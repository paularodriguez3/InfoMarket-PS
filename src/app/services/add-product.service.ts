import { Injectable } from '@angular/core';
import {Firestore, collection, collectionData, doc, setDoc, getDocs, query, addDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SubcategoryMap } from '../models/add-product.model';

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
    const productsRef = collection(this.firestore, `productos/${productData.category}/${productData.subcategory}`);
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
}
