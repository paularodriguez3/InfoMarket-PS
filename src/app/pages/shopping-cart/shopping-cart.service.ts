import {Injectable} from '@angular/core';

@Injectable()
export class ShoppingCartService {
  getCart(): any[] {
    const json = localStorage.getItem("cart");
    return json ? JSON.parse(json) : [];
  }

  saveCart(cart: any[]): void {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  addToCart(item: any , quantity: number): void {
    const shoppingCart = this.getCart();
    const cartItem = shoppingCart.find(e => e.id === item.id);
    if (cartItem) {
      item.Cantidad = quantity;
      shoppingCart.push(item);
    } else {
      cartItem.Cantidad += quantity;
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
    cartItem.Cantidad--;
    if (cartItem.Cantidad === 0) {
      shoppingCart.splice(shoppingCart.indexOf(cartItem), 1);
    }
  }
}
