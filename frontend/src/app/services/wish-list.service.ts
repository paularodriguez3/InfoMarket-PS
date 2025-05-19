import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  private storage = getStorage();  // Inicializa Storage
  private wishListSubject = new BehaviorSubject<Product[]>([]);
  wishListChanged$ = this.wishListSubject.asObservable();

  constructor(private firestore: Firestore, private auth: Auth) {}

  getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged(user => {
        unsubscribe();
        if (user) resolve(user);
        else reject('No hay usuario autenticado');
      });
    });
  }

  async addToWishList(product: Product): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      const productRef = doc(this.firestore, `users/${user.uid}/deseados/${product.id}`);
      await setDoc(productRef, { productoId: product.id });
      console.log('Referencia añadida a deseados correctamente');
      await this.refreshWishList(); // Emitir cambios
    } catch (error) {
      console.warn('No hay usuario autenticado o error al añadir a deseados:', error);
    }
  }

  async removeFromWishList(productId: string): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      const wishRef = doc(this.firestore, `users/${user.uid}/deseados/${productId}`);
      await deleteDoc(wishRef);
      await this.refreshWishList(); // Emitir cambios
    } catch (error) {
      console.error('Error al eliminar de deseados:', error);
    }
  }

  private async getImageUrl(path: string): Promise<string> {
    if (!path) return '';
    try {
      const imageRef = ref(this.storage, path);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error al obtener URL de la imagen:', error);
      return '';
    }
  }

  async getWishList(): Promise<Product[]> {
    try {
      const user = await this.getCurrentUser();
      const deseadosRef = collection(this.firestore, `users/${user.uid}/deseados`);
      const snapshot = await getDocs(deseadosRef);

      const products: Product[] = [];

      for (const docSnap of snapshot.docs) {
        const { productoId } = docSnap.data() as { productoId: string };
        if (!productoId) continue;

        const productRef = doc(this.firestore, `productos/${productoId}`);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = {
            id: productoId,
            ...productSnap.data() as Product
          };

          productData.Imagen = await this.getImageUrl(productData.Imagen);
          products.push(productData);
        }
      }

      return products;
    } catch (error) {
      console.error('Error al obtener la lista de deseados:', error);
      return [];
    }
  }

  private async refreshWishList(): Promise<void> {
    const products = await this.getWishList();
    this.wishListSubject.next(products); // Emitir al observable
  }
}
