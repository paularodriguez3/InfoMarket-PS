// src/app/pages/order-review/order-review.component.ts

import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';
import { OrderReviewTemplateComponent } from '../../components/order-review-template/order-review-template.component';
import { ShoppingProcessComponent } from '../../components/shopping-process/shopping-process.component';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FirebaseService} from '../../services/firebase.service';


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
  ]
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  paymentMethod: string = '';
  arrivalDate!: string;
  mostrarModal = false;
  valoracion = 1;
  comentario: string = '';


  constructor(private shoppingCartService : ShoppingCartService, private firebaseService : FirebaseService ) {}

  ngOnInit() {
    // Recuperar método de pago del state
    this.paymentMethod = history.state.paymentMethod || '';
    const orderId = history.state.orderId;

    // Calcular fecha aleatoria entre 14 y 60 días desde hoy
    const today = new Date().getTime();
    const minMs = 14 * 24 * 60 * 60 * 1000;   // 14 días
    const maxMs = 60 * 24 * 60 * 60 * 1000;   // 60 días
    const randMs = minMs + Math.random() * (maxMs - minMs);
    const arrival = new Date(today + randMs);

    // Formatear dd/MM/yyyy
    const dd = String(arrival.getDate()).padStart(2, '0');
    const mm = String(arrival.getMonth() + 1).padStart(2, '0');
    const yyyy = arrival.getFullYear();
    this.arrivalDate = `${dd}/${mm}/${yyyy}`;

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
