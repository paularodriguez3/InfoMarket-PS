import {Injectable} from '@angular/core';
import {ShoppingCartItem} from '../models/shopping-cart-item.model'
import {Product} from '../models/product.model';
import {BehaviorSubject} from 'rxjs';


@Injectable({providedIn:'root'})
export class ShoppingCartService {
  private cartChanged = new BehaviorSubject<number>(this.getLength());

  cartChanged$ = this.cartChanged.asObservable();

  getCart(): ShoppingCartItem[] {
    const json = localStorage.getItem("cart");
    return json ? JSON.parse(json) : [];
  }

  getLength(): number {
    return this.getCart().length;
  }

  saveCart(cart: ShoppingCartItem[]): void {
    localStorage.setItem("cart", JSON.stringify(cart));
    this.cartChanged.next(this.getLength());
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

  removeFromCart(item: ShoppingCartItem): void {
    const shoppingCart = this.getCart();
    const cartItem = shoppingCart.find(e => e.product.id === item.product.id);
    if (!cartItem) {
      console.log("Objeto no encontrado.");
      return;
    }
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      shoppingCart.splice(shoppingCart.indexOf(cartItem), 1);
    }
    this.saveCart(shoppingCart);
  }

  getTotal(): number {
    return this.getCart().reduce((total, item) => total + item.product.Precio * item.quantity, 0);
  }

  getTotalObservable(): BehaviorSubject<number> {
    const total = this.getTotal();
    return new BehaviorSubject<number>(total);
  }
}
