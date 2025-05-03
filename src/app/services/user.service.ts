import { Injectable, inject } from '@angular/core';
import {Firestore, doc, setDoc, deleteDoc} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore, { optional: true });

  constructor() {}

  async saveUserData(
    uid: string,
    email: string,
    username: string,
    emailVerified: boolean
  ): Promise<void> {
    if (!this.firestore) {
      throw new Error('Firestore no está funcionando correctamente.');
    }

    const userRef = doc(this.firestore, 'users', uid);

    await setDoc(userRef, {
      email,
      username,
      emailVerified
    });
  }

  async deleteUserData(uid: string): Promise<void> {
    if (!this.firestore) {
      throw new Error('Firestore no está disponible.');
    }

    const userRef = doc(this.firestore, 'users', uid);
    await deleteDoc(userRef);
  }
}
