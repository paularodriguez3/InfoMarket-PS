import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Firestore, collection, doc, setDoc, deleteDoc, getDocs, CollectionReference } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  private user: User | null = null;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  private getUserOrThrow(): User {
    if (!this.user) throw new Error('No hay usuario autenticado');
    return this.user;
  }

  async addToWishList(product: Product): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      console.warn('No hay usuario autenticado');
      return;
    }

    const productRef = doc(this.firestore, `users/${user.uid}/deseados/${product.id}`);

    // Convertir Caracteristicas (Feature[]) a objeto si es un array
    const convertedProduct: any = {
      ...product,
      Caracteristicas: Array.isArray(product.Caracteristicas)
        ? Object.fromEntries(product.Caracteristicas.map(f => [f.name, f.value]))
        : product.Caracteristicas
    };

    // Eliminar campos undefined
    const cleanProduct = Object.fromEntries(
      Object.entries(convertedProduct).filter(([_, value]) => value !== undefined)
    );

    try {
      await setDoc(productRef, cleanProduct);
      console.log('Producto añadido a deseados correctamente');
    } catch (error) {
      console.error('Error al añadir producto a deseados:', error);
    }
  }

  async removeFromWishList(productId: string): Promise<void> {
    try {
      const user = this.getUserOrThrow();
      const wishRef = doc(this.firestore, `users/${user.uid}/deseados/${productId}`);
      await deleteDoc(wishRef);
    } catch (error) {
      console.error('Error al eliminar de deseados:', error);
    }
  }

  async getWishList(): Promise<Product[]> {
    try {
      const user = this.getUserOrThrow();
      const collectionRef = collection(this.firestore, `users/${user.uid}/deseados`) as CollectionReference<Product>;
      const snapshot = await getDocs(collectionRef);
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error al obtener la lista de deseados:', error);
      return [];
    }
  }
}
