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
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth, { optional: true });
  private firestore = inject(Firestore);

  constructor() {}

  async signIn(email: string, password: string): Promise<any> {
    if (!this.auth) {
      throw new Error('InfoMarket informa de que el servicio de inicio de sesión no se encuentra disponible en este momento.');
    }

    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    try {
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

      console.log('Usuario logueado:', userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));

    } catch (e) {
      console.error('Error al obtener el rol del usuario:', e);
      const fallbackUser = {
        uid: user.uid,
        email: user.email,
        rol: 'Error'
      };
      localStorage.setItem('user', JSON.stringify(fallbackUser));
    }

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
}
