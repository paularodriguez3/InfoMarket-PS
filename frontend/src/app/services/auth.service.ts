import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  deleteUser as firebaseDeleteUser,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import {Firestore, doc, getDoc, updateDoc} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth, { optional: true });
  private firestore = inject(Firestore);

  constructor() {}

  async signIn(email: string, password: string): Promise<any> {
    if (!this.auth) {
      throw new Error('InfoMarket informa de que el servicio de inicio de sesión no está disponible en este momento.');
    }

    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      throw new Error('Debes verificar tu correo electrónico antes de poder acceder.');
    }

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userSnap = await getDoc(userDocRef);

    let rol = 'Desconocido';
    if (userSnap.exists()) {
      const userData = userSnap.data() as { rol?: string };
      rol = userData.rol || 'Sin rol';
    }

    const userInfo = {
      uid: user.uid,
      email: user.email,
      rol: rol
    };

    localStorage.setItem('user', JSON.stringify(userInfo));
    return user;
  }


  async registerUser(email: string, password: string, displayName: string): Promise<User> {
    if (!this.auth) {
      throw new Error('InfoMarket informa de que el servicio de registro no se encuentra disponible en este momento.');
    }

    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    if (!user.emailVerified) {
      await sendEmailVerification(user);
    }

    const userInfo = {
      uid: user.uid,
      email: user.email,
      rol: 'Desconocido'
    };

    localStorage.setItem('user', JSON.stringify(userInfo));

    return user;
  }

  getCurrentUser(): User | null {
    return this.auth?.currentUser || null;
  }

  async sendVerificationEmail(user: User): Promise<void> {
    if (!this.auth) return;
    await sendEmailVerification(user);
  }

  async signOut(): Promise<void> {
    if (!this.auth) return;
    await signOut(this.auth);
    localStorage.removeItem('user');
  }

  async deleteUser(): Promise<void> {
    if (!this.auth || !this.auth.currentUser) {
      throw new Error('No hay un usuario para eliminar cuenta.');
    }

    await firebaseDeleteUser(this.auth.currentUser);
  }

  async sendPasswordReset(email: string): Promise<void> {
    if (!this.auth) {
      throw new Error('El servicio de autenticación no está disponible.');
    }
    await sendPasswordResetEmail(this.auth, email);
  }

  async updateUserLanguage(uid: string, lang: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, { idioma: lang });
  }

  async getUserLanguage(uid: string): Promise<string | null> {
    const userRef = doc(this.firestore, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data()?.['idioma'] || null;
    }
    return null;
  }
}
