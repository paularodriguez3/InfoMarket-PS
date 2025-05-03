import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';
import {CardManagerComponent} from '../../components/card-manager/card-manager.component';
import {AddressManagerComponent} from '../../components/address-manager/address-manager.component';
import {DeleteAccountComponent} from '../../components/delete-account/delete-account.component';
@Component({
  selector: 'app-personal-profile',
  standalone: true,
  templateUrl: './personal-profile.component.html',
  styleUrl: './personal-profile.component.css',
  imports: [CommonModule, FormsModule, CardManagerComponent, AddressManagerComponent, DeleteAccountComponent]
})
export class PersonalProfileComponent implements OnInit {
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  uid = '';

  private router = inject(Router);
  private firestore = inject(Firestore, {optional: true});
  private auth = inject(Auth, {optional: true});
  showCardManager = false;
  toggleCardManager() {
    this.showCardManager = !this.showCardManager;
  }

  showAddressManager = false;
  toggleAddressManager() {
    this.showAddressManager = !this.showAddressManager;
    console.log('Mostrar direcciones:', this.showAddressManager);
  }

  showDeleteManager = false;
  toggleDeleteManager() {
    this.showDeleteManager = !this.showDeleteManager;
    console.log('Mostrar direcciones:', this.showDeleteManager);
  }
  ngOnInit() {
    if (!this.firestore) {
      console.warn('InfoMarket informa de que el perfil no funciona temporalmente, estamos intentando solucioanr el problema.');
      return;
    }

    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/sign-in']);
      return;
    }

    const user = JSON.parse(userData);
    this.uid = user.uid;
    this.loadUserData();
  }


  async loadUserData() {
    if (!this.firestore) return;

    try {
      const userRef = doc(this.firestore, 'users', this.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        this.username = data['username'] || '';
        this.firstName = data['firstName'] || '';
        this.lastName = data['lastName'] || '';
        this.email = data['email'] || '';
        this.phone = data['phone'] || '';
      } else {
        alert('No se encontraron datos del usuario.');
      }
    } catch (err) {
      console.error('Error al cargar el perfil:', err);
    }
  }


  async onSave() {
    if (!this.firestore) {
      alert('No se puede guardar: Firestore no está disponible.');
      return;
    }

    try {
      const userRef = doc(this.firestore, 'users', this.uid);
      await updateDoc(userRef, {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone
      });

      alert('Datos de perfil actualizados.');
    } catch (err) {
      console.error('Error al guardar el perfil:', err);
    }
  }


  async logout() {
    try {
      if (this.auth) await signOut(this.auth);
      localStorage.clear();
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }
}
