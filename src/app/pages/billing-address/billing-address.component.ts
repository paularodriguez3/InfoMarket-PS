import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';
import { ShoppingProcessComponent } from '../shopping-process/shopping-process.component';
import {user} from '@angular/fire/auth';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-billing-address',
  standalone: true,
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.css'],
  imports: [ShoppingProcessComponent, ShoppingInfoComponent, ReactiveFormsModule, FormsModule, CommonModule]
})
export class BillingAddressComponent implements OnInit {
  billingForm!: FormGroup;
  uid: string = JSON.parse(localStorage.getItem('user') || '{}')?.uid || '';
  addresses: any[] = [];
  selectedAddressId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private addressService: AddressService
  ) {}

  async ngOnInit(): Promise<void> {
    this.billingForm = this.fb.group({
      country: ['', Validators.required],
      address: ['', Validators.required],
      zip: ['', Validators.required],
      province: ['', Validators.required]
    });

    if (this.uid) {
      this.addresses = await this.addressService.getAddresses(this.uid);
    } else {
      console.warn('No se encontró el UID del usuario.');
    }
  }

  onAddressSelect(): void {
    const selected = this.addresses.find(a => a.id === this.selectedAddressId);
    if (selected) {
      const parts = selected.fullAddress.split(',');
      const cpMatch = selected.fullAddress.match(/(\d{5})$/);

      this.billingForm.patchValue({
        country: parts[0]?.trim() || '',
        province: parts[1]?.trim() || '',
        address: parts[2]?.trim() || '',
        zip: cpMatch ? cpMatch[1] : ''
      });
    }
  }

  onSubmit(): void {
    if (this.billingForm.valid) {
      console.log('Datos de facturación:', this.billingForm.value);
      this.router.navigate(['/shipping-method']).then(success => {
        if (!success) {
          console.warn('No se pudo navegar a /shipping-method');
        }
      });
    } else {
      alert('Por favor, completa todos los campos antes de continuar.');
    }
  }
  selectAddress(addressId: string): void {
    if (this.selectedAddressId === addressId) {
      this.selectedAddressId = '';
      this.billingForm.reset();
    } else {
      this.selectedAddressId = addressId;
      this.onAddressSelect();
    }
  }
}
