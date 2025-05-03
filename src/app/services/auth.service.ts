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
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth, { optional: true });

  constructor() {}

  async signIn(email: string, password: string): Promise<any> {
    if (!this.auth) {
      throw new Error('InfoMarket informa de que el servicio de inicio de sesión no se encuentra disponible en este momento.');
    }

    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    localStorage.setItem("user", JSON.stringify(userCredential.user));
    return userCredential.user;
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

    return user;
  }

  async sendVerificationEmail(user: User): Promise<void> {
    if (!this.auth) return;
    await sendEmailVerification(user);
  }

  async signOut(): Promise<void> {
    if (!this.auth) return;
    await signOut(this.auth);
  }

  async deleteUser(): Promise<void> {
    if (!this.auth || !this.auth.currentUser) {
      throw new Error('No hay un usuario para eliminar cuenta.');
    }

    await firebaseDeleteUser(this.auth.currentUser);
  }
}
