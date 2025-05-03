// src/app/pages/payment-method/payment-method.component.ts

import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingProcessComponent } from '../../components/shopping-process/shopping-process.component';
import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css'],
  imports: [
    ShoppingProcessComponent,
    ShoppingInfoComponent
  ]
})
export class PaymentMethodComponent implements AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const paymentFields  = document.getElementById('payment-fields')!;
    const continueButton = document.getElementById('continue-button')!;
    const paymentRadios  = document.querySelectorAll<HTMLInputElement>('input[name="payment"]');

    const renderFields = (method: string) => {
      paymentFields.innerHTML = '';
      if (method === 'credit') {
        paymentFields.innerHTML = `
          <input type="text" id="card-name"    placeholder="Nombre del Titular">
          <input type="text" id="card-number"  placeholder="Número de Tarjeta">
          <input type="text" id="card-expiry"  placeholder="Fecha de Expiración (MM/YY)">
          <input type="text" id="card-cvv"     placeholder="Código CVV (3 dígitos)">
        `;
      } else if (method === 'bizum') {
        paymentFields.innerHTML = `
          <input type="text" id="phone" placeholder="Número de Teléfono (9 dígitos)">
        `;
      } else if (method === 'paypal') {
        paymentFields.innerHTML = `
          <input type="email" id="paypal-email" placeholder="Correo electrónico de PayPal">
        `;
      }
    };

    /**
     * Comprueba que la fecha tenga formato MM/YY y mes entre 01–12.
     */
    const isValidFormat = (expiry: string): boolean => {
      const m = expiry.match(/^(\d{2})\/(\d{2})$/);
      if (!m) return false;
      const month = parseInt(m[1], 10);
      return month >= 1 && month <= 12;
    };

    /**
     * Comprueba si la fecha MM/YY ya ha expirado.
     */
    const isExpired = (expiry: string): boolean => {
      const m = expiry.match(/^(\d{2})\/(\d{2})$/);
      if (!m) return true; // formato inválido tratamos como expirado
      const month = parseInt(m[1], 10);
      const year  = 2000 + parseInt(m[2], 10);
      const lastDay = new Date(year, month, 0, 23, 59, 59);
      return lastDay < new Date();
    };

    /**
     * Validación básica de cada método (sin caducidad).
     */
    const validateFields = (method: string): boolean => {
      if (method === 'credit') {
        const name   = (document.getElementById('card-name')   as HTMLInputElement).value.trim();
        const number = (document.getElementById('card-number') as HTMLInputElement).value.trim();
        const expiry = (document.getElementById('card-expiry') as HTMLInputElement).value.trim();
        const cvv    = (document.getElementById('card-cvv')    as HTMLInputElement).value.trim();
        return !!name
          && /^\d{16}$/.test(number)
          && /^\d{2}\/\d{2}$/.test(expiry)
          && /^\d{3}$/.test(cvv);
      }
      if (method === 'bizum') {
        const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
        return /^\d{9}$/.test(phone);
      }
      if (method === 'paypal') {
        const email = (document.getElementById('paypal-email') as HTMLInputElement).value.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }
      return false;
    };

    // Cuando el usuario selecciona un método, renderizamos sus campos:
    paymentRadios.forEach(radio =>
      this.renderer.listen(radio, 'change', (e: Event) =>
        renderFields((e.target as HTMLInputElement).value)
      )
    );

    // Al pulsar "Pagar y finalizar":
    this.renderer.listen(continueButton, 'click', (e: Event) => {
      e.preventDefault();
      const selected = Array.from(paymentRadios).find(r => r.checked)?.value;
      if (!selected) {
        alert('Por favor, selecciona un método de pago.');
        return;
      }

      if (selected === 'credit') {
        const expiry = (document.getElementById('card-expiry') as HTMLInputElement).value.trim();
        if (!isValidFormat(expiry)) {
          alert('La fecha no es válida, por favor introduce otra tarjeta o utiliza otro método de pago.');
          return;
        }
        if (isExpired(expiry)) {
          alert('Tarjeta caducada, por favor utiliza otro método de pago o introduce una tarjeta válida.');
          return;
        }
      }

      if (!validateFields(selected)) {
        alert('Por favor, completa correctamente los campos del método de pago seleccionado.');
        return;
      }

      // Navegamos a Order Review pasando el método elegido en el state:
      this.router.navigate(['/order-review'], { state: { paymentMethod: selected } })
        .then(ok => { if (!ok) console.warn('No se pudo navegar a /order-review'); });
    });
  }
}
