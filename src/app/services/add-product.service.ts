import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  getDocs,
  query,
  addDoc,
  deleteDoc, updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SubcategoryMap } from '../models/add-product.model';
import {Product} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AddProductService {
  constructor(private firestore: Firestore) {}


  getFirestore() {
    return this.firestore;
  }

  getCategories(): Observable<string[]> {
    const categoriasRef = collection(this.firestore, 'productos');
    return new Observable<string[]>(observer => {
      collectionData(categoriasRef, { idField: 'id' }).subscribe((data: any[]) => {
        const categoryNames = data.map(doc => doc.id);
        console.log('Categorías:', categoryNames);
        observer.next(categoryNames);
      });
    });
  }

  // Devuelve subcategorías desde el modelo local
  getSubcategories(category: string): string[] {
    return SubcategoryMap[category] || [];
  }

  saveProduct(productData: any) {
    const productsRef = collection(this.firestore, `productos/${productData.Categoria}/${productData.Subcategoria}`);
    return addDoc(productsRef, productData); // Usamos addDoc para agregar el producto
  }


  async checkIfRouteExists(category: string, subcategory: string): Promise<boolean> {
    try {
      const productsRef = collection(this.firestore, `productos/${category}/${subcategory}`);
      const querySnapshot = await getDocs(query(productsRef));

      // Si la consulta devuelve algún documento, significa que la ruta existe
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error al consultar la ruta en Firestore:', error);
      return false;
    }
  }


  //===============================
  deleteProduct(id: string|undefined, category: string, subategory: string) {
    const docRef = doc(this.firestore, `productos/${category}/${subategory}/${id}`);
    deleteDoc(docRef);
  }


  async editProduct(old_product: Product, productData: any) {
    // TODO: Si cambia la categoría/Subcategoria el documento no cambia de ruta
    if (old_product.Categoria !== productData.Categoria || old_product.Subcategoria !== productData.Subcategoria) {
      this.deleteProduct(old_product.id, old_product.Categoria, old_product.Subcategoria);
      this.saveProduct(productData);
    } else {
      let docRef;
      if (productData.Subcategoria !== undefined) {
        docRef = doc(this.firestore, `productos/${productData.Categoria}/${productData.Subcategoria}`, old_product.id as string);
      } else {
        docRef = doc(this.firestore, `productos/${productData.Categoria}`, old_product.id as string);
      }
      updateDoc(docRef, productData);
    }
  }
}
