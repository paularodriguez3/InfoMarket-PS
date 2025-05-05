import {Injectable} from '@angular/core';
import {ShoppingCartItem} from '../models/shopping-cart-item.model'
import {Product} from '../models/product.model';
import {BehaviorSubject} from 'rxjs';


@Injectable({providedIn:'root'})
export class ShoppingCartService {
  private cartChanged = new BehaviorSubject<ShoppingCartItem[]>(this.getCart());
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
    this.cartChanged.next(cart);
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

  private getPrecioConDescuento(product: Product): number {
    const descuento = product.Descuento;
    if (descuento && descuento > 0 && descuento < 100) {
      return product.Precio * (1 - descuento / 100);
    }
    return product.Precio;
  }

  getTotal(): number {
    return this.getCart().reduce((total, item) => {
      const precioConDescuento = this.getPrecioConDescuento(item.product);
      return total + precioConDescuento * item.quantity;
    }, 0);
  }

  getTotalObservable(): BehaviorSubject<number> {
    const total = this.getTotal();
    return new BehaviorSubject<number>(total);
  }
}
