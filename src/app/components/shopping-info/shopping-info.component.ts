import {Component, OnInit} from '@angular/core';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {ShoppingCartItem} from '../../models/shopping-cart-item.model';
import {ProductInfoComponent} from '../product-info/product-info.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-shopping-info',
  standalone: true,
  templateUrl: './shopping-info.component.html',
  imports: [
    ProductInfoComponent,
    NgForOf
  ],
  styleUrl: './shopping-info.component.css'
})
export class ShoppingInfoComponent implements OnInit {
  shoppingCart: ShoppingCartItem[] = [];

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getCart();
  }

  calculateTotalPrice(): number {
    let total = 0;

    for (let item of this.shoppingCart) {
      const descuento = item.product.Descuento ?? 0;

      const precioFinal = descuento > 0 && descuento < 100
        ? item.product.Precio * (1 - descuento / 100)
        : item.product.Precio;

      total += Number((precioFinal * item.quantity).toFixed(2));
    }

    return total;
  }
}
