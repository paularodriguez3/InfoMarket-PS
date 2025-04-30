import {
  Firestore, addDoc, collection, query,
  doc, deleteDoc, updateDoc, setDoc, getDocs, where, getDoc
} from '@angular/fire/firestore';

import { inject, Injectable } from '@angular/core';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import {getDownloadURL, ref} from '@angular/fire/storage';

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
}
