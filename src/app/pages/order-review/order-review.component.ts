// src/app/pages/order-review/order-review.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { ShoppingProcessComponent } from '../../components/shopping-process/shopping-process.component';

import { ShoppingInfoComponent } from '../../components/shopping-info/shopping-info.component';
import { OrderReviewTemplateComponent } from '../../components/order-review-template/order-review-template.component';
import {ShoppingProcessComponent} from '../shopping-process/shopping-process.component';

@Component({
  selector: 'app-order-review',
  standalone: true,
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css'],
  imports: [
    ShoppingProcessComponent,
    ShoppingInfoComponent,
    OrderReviewTemplateComponent
  ]
})
export class OrderReviewComponent implements OnInit {
  paymentMethod: string = '';
  arrivalDate!: string;

  ngOnInit() {
    // Recuperar método de pago del state
    this.paymentMethod = history.state.paymentMethod || '';

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
  }
}
