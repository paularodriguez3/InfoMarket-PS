

import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingProcessComponent } from '../shopping-process/shopping-process.component';
import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';

@Component({
  selector: 'app-shipping-method',
  standalone: true,
  templateUrl: './shipping-method.component.html',
  styleUrls: ['./shipping-method.component.css'],
  imports: [ShoppingProcessComponent, ShoppingInfoComponent]
})
export class ShippingMethodComponent implements AfterViewInit {

  constructor(private renderer: Renderer2, private router: Router) {}

  ngAfterViewInit(): void {
    const addressInput    = document.getElementById('address') as HTMLInputElement;
    const shopSelect      = document.getElementById('shop')    as HTMLSelectElement;
    const continueButton  = document.getElementById('button')  as HTMLButtonElement;

    // validación al pulsar el botón
    this.renderer.listen(continueButton, 'click', (event: Event) => {
      event.preventDefault();

      const hasAddress = addressInput.value.trim() !== '';
      const hasShop    = shopSelect.value.trim()    !== '';

      if (!hasAddress && !hasShop) {
        alert('Por favor especifica una dirección o una tienda de recogida');
        return;
      }

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
}
