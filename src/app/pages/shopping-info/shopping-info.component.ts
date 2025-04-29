import { Component } from '@angular/core';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {ShoppingCartItem} from '../../models/shopping-cart-item.model';

@Component({
  selector: 'app-shopping-info',
  standalone: false,
  templateUrl: './shopping-info.component.html',
  styleUrl: './shopping-info.component.css'
})
export class ShoppingInfoComponent {
  shoppingCart: ShoppingCartItem[] = [];

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getCart();
  }

  calculateTotalPrice(): number {
    let total:number = 0;
    for (let item of this.shoppingCart) {
      total += item.product.Precio * item.quantity;
    }
    return total;
  }
}
