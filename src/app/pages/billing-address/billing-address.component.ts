import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ShoppingProcessComponent } from '../../components/shopping-process/shopping-process.component';
import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';

@Component({
  selector: 'app-billing-address',
  standalone: true,
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.css'],
  imports: [ShoppingProcessComponent, ShoppingInfoComponent, ReactiveFormsModule]
})
export class BillingAddressComponent implements OnInit {

  billingForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.billingForm = this.fb.group({
      country: ['', Validators.required],
      address: ['', Validators.required],
      zip: ['', Validators.required],
      province: ['', Validators.required]
    });
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
}
