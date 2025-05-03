import {Component, Input, OnInit} from '@angular/core';
import {AddressService} from '../../services/address.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-address-manager',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './address-manager.component.html',
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

  constructor(private addressService: AddressService) {}

  async ngOnInit() {
    if (this.uid) {
      this.addresses = await this.addressService.getAddresses(this.uid);
    }
  }

  async addAddress() {
    if (!this.uid) return;

    const fullAddress = `${this.pais}, ${this.provincia}, ${this.calle}, Piso ${this.piso}${this.letra ? ' ' + this.letra : ''}, CP ${this.codigoPostal}`;

    const newAddress = await this.addressService.addAddress(this.uid, { fullAddress });

    this.addresses.push(newAddress);

    this.pais = '';
    this.provincia = '';
    this.calle = '';
    this.piso = '';
    this.letra = '';
    this.codigoPostal = '';
    this.showAddForm = false;
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
}
