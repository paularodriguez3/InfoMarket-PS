// src/app/pages/order-review/order-review.component.ts

import {Component, inject, OnDestroy, OnInit} from '@angular/core';

import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';
import { OrderReviewTemplateComponent } from '../../components/order-review-template/order-review-template.component';
import { ShoppingProcessComponent } from '../../components/shopping-process/shopping-process.component';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FirebaseService} from '../../services/firebase.service';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ProductService} from '../../services/product.service';

@Component({
  selector: 'app-order-review',
  standalone: true,
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css'],
  imports: [
    ShoppingProcessComponent,
    ShoppingInfoComponent,
    OrderReviewTemplateComponent,
    FormsModule,
    NgIf,
    NgClass,
    NgForOf,
    TranslatePipe,
  ]
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  paymentMethod: string = '';
  arrivalDate!: string;
  mostrarModal = false;
  valoracion = 1;
  comentario: string = '';
  router: Router = inject(Router);
  firestoreService = inject(ProductService);


  constructor(private shoppingCartService : ShoppingCartService, private firebaseService : FirebaseService ) {}

  ngOnInit() {
    // Recuperar método de pago del state
    this.paymentMethod = history.state.paymentMethod || '';
    const orderId = history.state.orderId;

    if (orderId) {
      this.firebaseService.readDoc("pedidos", orderId).then((result) => {
        this.arrivalDate = result.arrivalDate;
      })
    }

    if (orderId && !localStorage.getItem(`modalMostrado_${orderId}`)) {
      setTimeout(() => {
        this.mostrarModal = true;
        localStorage.setItem(`modalMostrado_${orderId}`, 'true');
      }, 500);
    }
  }

  async valorar() {
    const valoracion = {
      puntuacion: this.valoracion,
      comentario: this.comentario.trim() || null,
      fecha: new Date()
    };

    try {
      await this.firebaseService.createDocOnCollection('valoraciones', valoracion);
      alert('Valoración enviada con éxito');
    } catch (error) {
      console.error('Error al enviar la valoración:', error);
      alert('Hubo un problema al enviar la valoración. Intenta nuevamente.');
    }
    this.cerrarModal();
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  seleccionarEstrella(index: number) {
    this.valoracion = index + 1;
  }

  ngOnDestroy() {
    this.shoppingCartService.clearCart();
  }
}
