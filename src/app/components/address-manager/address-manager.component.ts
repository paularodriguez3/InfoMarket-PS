import {Component, Input, OnInit} from '@angular/core';
import {AddressService} from '../../services/address.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-address-manager',
  imports: [
    FormsModule,
    CommonModule,
    TranslatePipe
  ],
    templateUrl: './address-manager.component.html',
    standalone: true,
    styleUrl: './address-manager.component.css'
})
export class AddressManagerComponent implements OnInit {
  @Input() uid: string = '';

  addresses: any[] = [];
  showAddForm = false;

  pais = '';
  provincia = '';
  calle = '';
  piso = '';
  letra = '';
  codigoPostal = '';

  addressToDelete: any = null;
  showConfirmPopup = false;

  editMode = false;
  editingAddress: any = null;


  constructor(private addressService: AddressService) {}

  async ngOnInit() {
    if (this.uid) {
      this.addresses = await this.addressService.getAddresses(this.uid);
    }
  }

  async addAddress() {
    if (!this.uid) return;

    if (!this.pais.trim() || !this.provincia.trim() || !this.calle.trim() || !this.codigoPostal.trim()) {
      this.showFloatingMessage('Por favor, completa todos los campos obligatorios.', false);
      return;
    }

    const fullAddress = `${this.pais}, ${this.provincia}, ${this.calle}, Piso ${this.piso || '-'}${this.letra ? ' ' + this.letra : ''}, CP ${this.codigoPostal}`;

    try {
      if (this.editMode && this.editingAddress?.id) {

        await this.addressService.editAddressById(this.uid, this.editingAddress.id, { fullAddress });

        const index = this.addresses.findIndex(a => a.id === this.editingAddress.id);
        if (index !== -1) this.addresses[index].fullAddress = fullAddress;

        this.showFloatingMessage('Dirección actualizada con éxito.', true);
      } else {

        const newAddress = await this.addressService.addAddress(this.uid, { fullAddress });
        this.addresses.push(newAddress);

        this.showFloatingMessage('Dirección guardada con éxito.', true);
      }

      this.pais = '';
      this.provincia = '';
      this.calle = '';
      this.piso = '';
      this.letra = '';
      this.codigoPostal = '';
      this.showAddForm = false;
      this.editMode = false;
      this.editingAddress = null;

    } catch (error) {
      console.error('Error al guardar la dirección:', error);
      this.showFloatingMessage('Error al guardar la dirección. Inténtalo de nuevo.', false);
    }
  }

  startEditingAddress(address: any) {
    this.editMode = true;
    this.editingAddress = address;

    const parts = address.fullAddress.split(',');
    this.pais = parts[0]?.trim() || '';
    this.provincia = parts[1]?.trim() || '';
    this.calle = parts[2]?.trim() || '';
    this.piso = parts[3]?.match(/Piso\s(.*?)(?:\s|$)/)?.[1] || '';
    this.letra = parts[3]?.match(/Piso\s.*?\s(.*)/)?.[1] || '';
    this.codigoPostal = parts[4]?.replace('CP', '').trim() || '';

    this.showAddForm = true;
  }


  floatingMessage = '';
  floatingSuccess = false;

  showFloatingMessage(message: string, success: boolean) {
    this.floatingMessage = message;
    this.floatingSuccess = success;

    setTimeout(() => {
      this.floatingMessage = '';
    }, 3000);
  }



  confirmDelete(address: any) {
    this.addressToDelete = address;
    this.showConfirmPopup = true;
  }

  cancelDelete() {
    this.addressToDelete = null;
    this.showConfirmPopup = false;
  }

  async confirmDeleteAddress() {
    if (!this.uid || !this.addressToDelete?.id) return;

    await this.addressService.deleteAddressById(this.uid, this.addressToDelete.id);
    this.addresses = this.addresses.filter(a => a.id !== this.addressToDelete.id);
    this.cancelDelete();
  }

  resetForm() {
    this.pais = '';
    this.provincia = '';
    this.calle = '';
    this.piso = '';
    this.letra = '';
    this.codigoPostal = '';
    this.editMode = false;
    this.editingAddress = null;
  }
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

}
