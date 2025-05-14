import {Component, inject, OnInit} from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';
import { FormsModule } from '@angular/forms';
import { loadPayPalSDK } from '../../environments/environment.development'; // Importa la función que carga el SDK de PayPal
import { Router } from '@angular/router';
import {ShoppingProcessComponent} from '../../components/shopping-process/shopping-process.component';
import {ProductService} from '../../services/product.service';
import {CardManagerComponent} from '../../components/card-manager/card-manager.component';
import {CardManagerPaymentComponent} from '../../components/card-manager-payment/card-manager-payment.component';
import {Firestore} from '@angular/fire/firestore';  // Importar el Router

@Component({
  selector: 'app-payment-method',
  standalone: true,
  templateUrl: './payment-method.component.html',
  imports: [
    ShoppingInfoComponent,
    FormsModule,
    ShoppingProcessComponent,
    CardManagerPaymentComponent,
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
  protected userUID: string = "";
  private firestore: Firestore = inject(Firestore);

  constructor(private shoppingCartService: ShoppingCartService, private router: Router, private firebaseService: ProductService) {}  // Inyectar el Router

  ngOnInit(): void {
    this.updateTotal();
    this.shoppingCartService.cartChanged$.subscribe(() => {
      this.updateTotal();
    });

    loadPayPalSDK().then(() => {
      this.renderPayPalButton(); // Llama a la función después de que el SDK se haya cargado
      let prueba = document.getElementById("credit-card-number") as HTMLInputElement;
      prueba.value = "hola";
    }).catch((error) => {
      console.error('Error al cargar el SDK de PayPal:', error);
    });
    if (localStorage.getItem("user")) {
      this.userUID = <string>JSON.parse(<string>localStorage.getItem("user")).uid;
    }
    const pedido = JSON.parse(<string>this.localStorage.getItem("pedido"));

    const pedidoNuevo = {...pedido,
      precioTotal: this.totalAmount.toFixed(2),
      usuario: this.userUID}

    localStorage.setItem("pedido", JSON.stringify(pedidoNuevo));

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
      const pedido = JSON.parse(<string>localStorage.getItem("pedido"));
      const pedidoNuevo = {...pedido,
        precioTotal: this.totalAmount.toFixed(2),
        usuario: this.userUID
      }

      localStorage.setItem("pedido", JSON.stringify(pedidoNuevo));
      alert(`Código aplicado. Nuevo total: ${this.totalAmount.toFixed(2)}€`);
    } else {
      this.totalAmount = this.totalOriginal;
      alert("Código inválido o expirado.");
    }
  }

  getTotalWithoutTax(): number {
    return parseFloat((this.totalAmount / (this.taxRate+1)).toFixed(2));
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
              value: this.totalAmount.toFixed(2)
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then(async (details: any) => {
          alert('Pago realizado con éxito por ' + details.payer.name.given_name);

          // Redirigir usando Angular Router
            const pedido = JSON.parse(localStorage.getItem('pedido') || '{}');
            if (!pedido || Object.keys(pedido).length === 0) {
              alert('No se encontró información del pedido.');
              return;
            }
            try {
              await this.firebaseService.createDocOnCollection('pedidos', pedido);
              await this.firebaseService.updateStock(pedido.productos);
              if (this.userUID !== "") {
                this.firebaseService.updateOrders(pedido, this.userUID);
              }


              this.router.navigate(['/order-review'], { state: { paymentMethod: 'Tarjeta de crédito' } });
            } catch (error) {
              console.error('Error al guardar el pedido:', error);
              alert('Hubo un problema al guardar el pedido. Intenta nuevamente.');
            }
        });
      },
      onError: (err: any) => {
        alert('Ha ocurrido un error en el proceso de pago: ' + err);
      }
    }).render('#paypal-button-container'); // Asegúrate de que el contenedor del botón está bien definido en tu HTML
  }

  protected readonly localStorage = localStorage;
}
