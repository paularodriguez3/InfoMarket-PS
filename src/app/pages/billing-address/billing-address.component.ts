import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';
import { ShoppingProcessComponent } from '../../components/shopping-process/shopping-process.component';
import {CommonModule} from '@angular/common';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-billing-address',
  standalone: true,
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.css'],
  imports: [ShoppingProcessComponent, ShoppingInfoComponent, ReactiveFormsModule, FormsModule, CommonModule]
})
export class BillingAddressComponent implements OnInit, AfterViewInit {
  billingForm!: FormGroup;
  uid: string = JSON.parse(localStorage.getItem('user') || '{}')?.uid || '';
  addresses: any[] = [];
  selectedAddressId: string = '';
  tiendas: any[] = [];
  pedido: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private addressService: AddressService,
    private firebaseService: FirebaseService,
    private renderer: Renderer2
  ) {}

  async ngOnInit(): Promise<void> {
    const stored = localStorage.getItem('pedido');
    if (stored) {
      this.pedido = JSON.parse(stored);
    } else {
      this.pedido = {};
    }

    this.billingForm = this.fb.group({
      country: ['', Validators.required],
      address: ['', Validators.required],
      zip: ['', Validators.required],
      province: ['', Validators.required],
      shop: ['', Validators.required]
    });

    if (this.uid) {
      this.addresses = await this.addressService.getAddresses(this.uid);
    } else {
      console.warn('No se encontró el UID del usuario.');
    }
    const shops = await this.firebaseService.readCollection("direccionesTiendas");
    for (let item in shops) {
      this.tiendas.push(shops[item]);
    }
  }

  ngAfterViewInit(): void {
    const addressInput    = document.getElementById('address') as HTMLInputElement;
    const shopSelect      = document.getElementById('shop')    as HTMLSelectElement;
    const continueButton  = document.getElementById('continue-button')  as HTMLButtonElement;

    // validación al pulsar el botón
    this.renderer.listen(continueButton, 'click', (event: Event) => {
      event.preventDefault();

      const hasAddress = addressInput.value.trim() !== '';
      const hasShop    = shopSelect.value.trim()    !== '';

      if (!hasAddress && !hasShop) {
        alert('Por favor especifica una dirección o una tienda de recogida');
        return;
      }

      let direccionFinal = {};

      if (hasAddress) {
        direccionFinal = {
          pais: this.billingForm.value.country,
          direccion: this.billingForm.value.address,
          codigoPostal: this.billingForm.value.zip,
          provincia: this.billingForm.value.province,
          tipo: 'envio'
        };
      } else if (hasShop) {
        const tiendaSeleccionada = this.tiendas.find(t => t.direccion === this.billingForm.value.shop);
        direccionFinal = {
          direccion: this.tiendas[0],
          tipo: 'recogida',
        };
      }

      this.pedido.direccion = direccionFinal;
      localStorage.setItem('pedido', JSON.stringify(this.pedido));

      console.log(this.pedido);
      // si pasa validación, navegar normalmente
      this.router.navigate(['/payment-method']).then(ok => {
        if (!ok) console.warn('No se pudo navegar a /payment-method');
      });
    });

    // lógica de desactivar campos mutuamente
    if (addressInput && shopSelect) {
      const toggle = () => {
        if (addressInput.value.trim()) {
          shopSelect.value = '';
          shopSelect.disabled = true;
        } else {
          shopSelect.disabled = false;
        }
        if (shopSelect.value.trim()) {
          addressInput.value = '';
          addressInput.disabled = true;
        } else {
          addressInput.disabled = false;
        }
      };
      this.renderer.listen(addressInput, 'input', toggle);
      this.renderer.listen(shopSelect, 'change', toggle);
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
