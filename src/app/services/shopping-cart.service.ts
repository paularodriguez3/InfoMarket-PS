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

  removeCompletelyFromCart(product: Product): void {
    const cart = this.getCart().filter(item => item.product.id !== product.id);
    this.saveCart(cart);
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

    const cantidadActual = cartItem ? cartItem.quantity : 0;
    const cantidadTotal = cantidadActual + quantity;

    if (item.Stock !== undefined && cantidadTotal > item.Stock) {
      alert(`No hay suficiente stock disponible`);
      return;
    }

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

  clearCart() {
    localStorage.removeItem("cart");
    this.cartChanged.next([])
  }

  isEmpty(): boolean {
    return this.getLength() === 0;
  }
}
