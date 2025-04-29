import {Injectable} from '@angular/core';
import {ShoppingCartItem} from '../models/shopping-cart-item.model'
import {Product} from '../models/product.model';


@Injectable({providedIn:'root'})
export class ShoppingCartService {
  getCart(): ShoppingCartItem[] {
    const json = localStorage.getItem("cart");
    return json ? JSON.parse(json) : [];
  }

  saveCart(cart: ShoppingCartItem[]): void {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  addToCart(item: Product, quantity: number): void {
    const shoppingCart = this.getCart();
    const cartItem = shoppingCart.find(e => e.product.id === item.id);
    if (!cartItem) {
      shoppingCart.push({product: item, quantity: quantity});
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
