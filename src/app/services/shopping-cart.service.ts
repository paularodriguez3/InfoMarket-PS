import {Injectable} from '@angular/core';
import {ShoppingCartItem} from '../models/shopping-cart-item.model'


@Injectable({providedIn:'root'})
export class ShoppingCartService {
  getCart(): ShoppingCartItem[] {
    const json = localStorage.getItem("cart");
    return json ? JSON.parse(json) : [];
  }

  saveCart(cart: ShoppingCartItem[]): void {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  addToCart(item: ShoppingCartItem, quantity: number): void {
    const shoppingCart = this.getCart();
    const cartItem = shoppingCart.find(e => e.id === item.id);
    if (!cartItem) {
      item.quantity = quantity;
      shoppingCart.push(item);
    } else {
      cartItem.quantity+= quantity;
    }
    this.saveCart(shoppingCart);
  }

  removeFromCart(item: any): void {
    const shoppingCart = this.getCart();
    const cartItem = shoppingCart.find(e => e.id === item.id);
    if (!cartItem) {
      console.log("Objeto no encontrado.");
      return;
    }
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      shoppingCart.splice(shoppingCart.indexOf(cartItem), 1);
    }
  }
}
