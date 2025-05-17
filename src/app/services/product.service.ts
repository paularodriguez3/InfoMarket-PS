import {
  Firestore, addDoc, collection, query,
  doc, deleteDoc, updateDoc, setDoc, getDocs, where, getDoc, collectionData, docData,
  arrayUnion, limit, orderBy, startAfter, QueryDocumentSnapshot, WhereFilterOp
} from '@angular/fire/firestore';

import { inject, Injectable } from '@angular/core';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import {getDownloadURL, ref} from '@angular/fire/storage';
import {catchError, combineLatest, map, Observable, of, switchMap, tap} from 'rxjs';
import {Product} from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private firestore = inject(Firestore);
  private storage: FirebaseStorage = getStorage();

  constructor() {}

  async readCollection(cole: string): Promise<any> {
    const colRef = collection(this.firestore, cole); // SOLO el string de path
    const colSnap = await getDocs(colRef);
    const data: any = {};
    colSnap.forEach((item) => { data[item.id] = item.data(); });
    return data;
  }

  async readDoc(cole: string, document: string): Promise<any> {
    const docRef = doc(this.firestore, cole, document);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No existe el documento");
      return null;
    }
  }

  async createDocOnCollection(cole: string, data: any): Promise<string> {
    const docRef = await addDoc(collection(this.firestore, cole), data);
    return docRef.id;
  }

  async updateDocOnCollection(cole: string, id: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, cole, id);
    await updateDoc(docRef, data);
  }

  async deleteDocOnCollection(cole: string, document: string): Promise<void> {
    await deleteDoc(doc(this.firestore, cole, document));
  }

  async filterEqualsByFieldOnCollection(cole: string, field: string, equals: any): Promise<any> {
    const q = query(collection(this.firestore, cole), where(field, "==", equals));
    const querySnapshot = await getDocs(q);
    const data: any = {};
    querySnapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });
    return data;
  }

  async filterByFieldOnCollection(cole: string, field: string, filter: any, value: any): Promise<any> {
    const q = query(collection(this.firestore, cole), where(field, filter, value));
    const querySnapshot = await getDocs(q);
    const data: any = {};
    querySnapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });
    return data;
  }

  async getImageUrl(imgName: string): Promise<string> {
    const url = await getDownloadURL(ref(this.storage, imgName));
    return url;
  }

  getProductById(categoria: string, subcategoria: string, id: string) {
    return docData(doc(this.firestore, `productos/${categoria}/${subcategoria}/${id}`), { idField: 'id' }) as Observable<Product>;
  }

  async getCategory(document: string): Promise<any> {
    const docSnap = await this.readDoc('productos', document);
    const res: any = {};

    if (docSnap?.subcolecciones) {
      const promises = docSnap.subcolecciones.map(async (subcoleccion: string) => {
        const subcol = await this.readCollection('productos' + "/" + document + "/" + subcoleccion);
        for (const prod in subcol) {
          res[prod] = subcol[prod];
        }
      });
      await Promise.all(promises);
    }

    return res;
  }

  async getAllProducts(): Promise<any> {
    const categorias = ['Informatica', 'Gaming', 'Telefonia', 'Televisores', 'Electrodomesticos']; // ajusta según tengas
    const all: any = {};

    for (const cat of categorias) {
      const subproductos = await this.getCategory(cat);
      for (const id in subproductos) {
        all[id] = subproductos[id];
      }
    }

    return all;
  }

  getCategoryRealtime(categoria: string): Observable<Record<string, any>> {
    const ref = doc(this.firestore, 'productos', categoria);

    return docData(ref).pipe(
      switchMap(doc => {
        if (!doc || !Array.isArray(doc['subcolecciones'])) {
          return of({});
        }

        const subcolecciones = doc['subcolecciones'] as string[];
        const observables = subcolecciones.map(sub => {
          const path = `productos/${categoria}/${sub}`;
          const colRef = collection(this.firestore, path);
          return collectionData(colRef, { idField: 'id' }).pipe(
            catchError(() => of([]))
          );
        });

        return combineLatest(observables).pipe(
          map(subarrays =>
            Object.fromEntries(
              subarrays.flat().map(item => [item.id, item])
            )
          )
        );
      }),
      catchError(() => of({}))
    );
  }

  getAllProductsRealtime(): Observable<Record<string, any>> {
    const categorias = ['Informatica', 'Gaming', 'Telefonia', 'Televisores', 'Electrodomesticos'];

    const observablesPorCategoria = categorias.map(cat =>
      this.getCategoryRealtime(cat).pipe(
        catchError(err => {
          console.error('Error en getCategoryRealtime:', cat, err);
          return of({});
        })
      )
    );

    return combineLatest(observablesPorCategoria).pipe(
      tap(() => console.log('combineLatest emitido')),
      map((resultadosPorCategoria: Record<string, any>[]) => {
        const productosAplanados = Object.assign({}, ...resultadosPorCategoria);
        console.log('Productos combinados:', productosAplanados);
        return productosAplanados;
      })
    );
  }

  getSubcategoryRealtime(path: string): Observable<any[]> {
    const colRef = collection(this.firestore, path);
    return collectionData(colRef, { idField: 'id' });
  }

  readDocRealtime(collectionName: string, docId: string): Observable<any> {
    const ref = doc(this.firestore, collectionName, docId);
    return collectionData(ref.parent, { idField: 'id' }).pipe(
      map(docs => docs.find(d => d['id'] === docId))
    );
  }

  async updateStock(productos: any[]): Promise<void> {
    for (const item of productos) {
      const ref = doc(
        this.firestore,
        `productos/${item.product.Categoria}/${item.product.Subcategoria}/${item.product.id}`
      );

      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) continue;

      const data = snapshot.data();
      const stockActual = data["Stock"] ?? 0;
      const nuevoStock = stockActual - item.quantity;

      await updateDoc(ref, {
        Stock: nuevoStock
      });
    }
  }

  updateOrders(pedido: any, userUID: string) {
    const docRef = doc(this.firestore, 'users', userUID);
    updateDoc(docRef, {
      pedidos: arrayUnion(pedido)
    });
  }

  // ======================== Lazy ========================
  getProductsLazy(
    limitNumber: number,
    orderParam: string|null,
    whereParams: string[],
    startAfterDoc?: QueryDocumentSnapshot<any>|null
  ):Observable<{data:any[], lastDoc:QueryDocumentSnapshot<any>|null}> {


    const q = this.getQuery(limitNumber, orderParam, whereParams, startAfterDoc);

    return new Observable(observer => {
      getDocs(q).then(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
        observer.next({ data, lastDoc: lastVisible });
        observer.complete();
      }).catch(err => observer.error(err));
    });

  }

  searchProductsLazy(
    search:string,
    limitNumber: number,
    orderParam: string|null,
    whereParams: string[],
    startAfterDoc?: QueryDocumentSnapshot<any>|null
  ):Observable<{data:any[], lastDoc:QueryDocumentSnapshot<any>|null}> {

    const q = this.getQuery(null, orderParam, whereParams, startAfterDoc);

    return new Observable(observer => {
      getDocs(q).then(snapshot => {
        const data = [];
        for (const doc of snapshot.docs) {
          const product: Product = {id: doc.id, ...doc.data()} as Product;
          if(product.Nombre.toLowerCase().includes(search.toLowerCase())) data.push(product);
          if(data.length >= limitNumber) break;
        }

        console.log(snapshot.docs);
        const lastVisible = snapshot.docs[snapshot.docs.length-1] || null;
        observer.next({ data, lastDoc: lastVisible });
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  getQuery(
    limitNumber: number|null,
    orderParam: string|null,
    whereParams: string[],
    startAfterDoc?: QueryDocumentSnapshot<any>|null
  ) {
    const colRef = collection(this.firestore, "productos");

    let queryConstraints = [];

    if(orderParam) {
      let orderParamList = orderParam.split(' ');
      if (orderParamList.length > 1) {
        queryConstraints.push(orderBy(orderParamList[0], "desc"))
      } else {
        queryConstraints.push(orderBy(orderParamList[0]));
      }
    }

    if (whereParams.length>0) {
      for (let whereParam of whereParams) {
        let whereParamSplit = whereParam.split(' ');
        console.log(whereParamSplit[0], whereParamSplit[1], Number(whereParamSplit[2]));
        if (isNaN(Number(whereParamSplit[2]))) {
          queryConstraints.push(where(whereParamSplit[0], whereParamSplit[1] as WhereFilterOp, whereParamSplit[2]));
        } else {
          queryConstraints.push(where(whereParamSplit[0], whereParamSplit[1] as WhereFilterOp, Number(whereParamSplit[2])));
        }
      }
    }

    if (startAfterDoc) queryConstraints.push(startAfter(startAfterDoc));
    if (limitNumber) queryConstraints.push(limit(limitNumber));

    return query(colRef, ...queryConstraints);
  }
  // ======================================================

  async copiarProductos() {
    const estructura = [
      { categoria: 'Informatica', subcategorias: ['Cascos y auriculares', 'PC', 'Portatiles', 'Raton', 'Teclado'] },
    ];

    for (const { categoria, subcategorias } of estructura) {
      for (const subcategoria of subcategorias) {
        const subcatRef = collection(this.firestore, `productos/${categoria}/${subcategoria}`);
        const productosSnap = await getDocs(subcatRef);

        for (const productoDoc of productosSnap.docs) {
          const productoData = productoDoc.data();

          const nuevoDoc = {
            ...productoData,
            categoria,
            subcategoria
          };

          await setDoc(doc(this.firestore, 'productos', productoDoc.id), nuevoDoc);
          console.log(`Copiado ${productoDoc.id} desde ${categoria}/${subcategoria}`);
        }
      }
    }

    console.log('✅ Copia completa');
  }

  async valorarProducto(productId: string, valoracion: any, categoria: string, subcategoria: string): Promise<void> {
    const productoRef = doc(this.firestore, `productos/${productId}`);

    await updateDoc(productoRef, {
      Valoraciones: arrayUnion(valoracion)
    });
  }

  // Para la copia de seguridad:
  async copia_de_seguridad(): Promise<void> {
    const estructura = [
      { categoria: 'Informatica', subcategorias: ['Cascos y auriculares', 'PC', 'Portatiles', 'Raton', 'Teclado'] },
      { categoria: 'Gaming', subcategorias: ['Consolas', 'Microfono', 'Portatil gaming'] },
      { categoria: 'Telefonia', subcategorias: [] },
      { categoria: 'Televisores', subcategorias: [] },
      { categoria: 'Electrodomesticos', subcategorias: [] }
    ];

    for (const { categoria, subcategorias } of estructura) {
      for (const subcategoria of subcategorias) {
        const subcatRef = collection(this.firestore, `productos/${categoria}/${subcategoria}`);
        const productosSnap = await getDocs(subcatRef);

        for (const productoDoc of productosSnap.docs) {
          const productoData = productoDoc.data();

          // Ruta de destino en productos_copia
          const copiaRef = doc(this.firestore, `productos_copia/${categoria}/${subcategoria}/${productoDoc.id}`);

          await setDoc(copiaRef, productoData);
          console.log(`✅ Copiado: ${productoDoc.id} desde ${categoria}/${subcategoria}`);
        }
      }
    }

    console.log('✅ Copia de seguridad completa en /productos_copia');
  }
}
