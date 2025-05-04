import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';
import { FormsModule } from '@angular/forms';
import { loadPayPalSDK } from '../../environments/environment.development'; // Importa la función que carga el SDK de PayPal
import { Router } from '@angular/router';  // Importar el Router

@Component({
  selector: 'app-payment-method',
  standalone: true,
  templateUrl: './payment-method.component.html',
  imports: [
    ShoppingInfoComponent,
    FormsModule,
  ],
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  totalOriginal: number = 0;
  totalAmount: number = 0;
  discountCode: string = '';
  taxRate: number = 0.07; // 7% IGIC

  descuentos: { [code: string]: { tipo: 'fijo' | 'porcentaje', valor: number } } = {
    "DESCUENTO5": { tipo: 'fijo', valor: 5.00 },
    "DESCUENTO2": { tipo: 'fijo', valor: 2.00 },
    "DESCUENTO25": { tipo: 'porcentaje', valor: 25 },
    "DESCUENTO33": { tipo: 'porcentaje', valor: 33 }
  };

  constructor(private shoppingCartService: ShoppingCartService, private router: Router) {}  // Inyectar el Router

  ngOnInit(): void {
    this.updateTotal();
    this.shoppingCartService.cartChanged$.subscribe(() => {
      this.updateTotal();
    });

    loadPayPalSDK().then(() => {
      this.renderPayPalButton(); // Llama a la función después de que el SDK se haya cargado
    }).catch((error) => {
      console.error('Error al cargar el SDK de PayPal:', error);
    });
  }

  updateTotal(): void {
    this.totalOriginal = this.shoppingCartService.getTotal();
    this.totalAmount = this.totalOriginal;
  }

  aplicarDescuento(): void {
    const codigo = this.discountCode.trim().toUpperCase();
    const descuento = this.descuentos[codigo];

    if (descuento) {
      if (descuento.tipo === 'fijo') {
        this.totalAmount = Math.max(this.totalOriginal - descuento.valor, 0);
      } else if (descuento.tipo === 'porcentaje') {
        const rebaja = this.totalOriginal * (descuento.valor / 100);
        this.totalAmount = Math.max(this.totalOriginal - rebaja, 0);
      }
      alert(`Código aplicado. Nuevo total: ${this.totalAmount.toFixed(2)}€`);
    } else {
      this.totalAmount = this.totalOriginal;
      alert("Código inválido o expirado.");
    }
  }

  getTaxAmount(): number {
    return parseFloat((this.totalAmount * this.taxRate).toFixed(2));
  }

  getTotalWithTax(): number {
    return parseFloat((this.totalAmount + this.getTaxAmount()).toFixed(2));
  }

  renderPayPalButton(): void {
    paypal.Buttons({
      funding: {
        // Asegúrate de que no estás bloqueando tarjetas aquí
        disallowed: [paypal.FUNDING.CREDIT, paypal.FUNDING.DEBIT] // Opcional, elimina o comenta si deseas permitir el uso de tarjetas
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.getTotalWithTax().toFixed(2)
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then(async (details: any) => {
          alert('Pago realizado con éxito por ' + details.payer.name.given_name);

          // Redirigir usando Angular Router
          this.router.navigate(['/order-review']);  // Redirigir a la página order-review
        });
      },
      onError: (err: any) => {
        alert('Ha ocurrido un error en el proceso de pago: ' + err);
      }
    }).render('#paypal-button-container'); // Asegúrate de que el contenedor del botón está bien definido en tu HTML
  }
}
