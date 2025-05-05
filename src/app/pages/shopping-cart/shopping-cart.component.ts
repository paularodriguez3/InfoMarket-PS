import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {ShoppingCartItem} from '../../models/shopping-cart-item.model';
import {NgFor, NgIf} from '@angular/common';
import {ProductInfoComponent} from '../../components/product-info/product-info.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    NgFor,
    ProductInfoComponent,
    NgIf
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{
  shoppingCart: ShoppingCartItem[] = []

  constructor(private shoppingCartService: ShoppingCartService, private router: Router) {}

  ngOnInit(): void{
    this.shoppingCart = this.shoppingCartService.getCart();
  }

  increase(item: ShoppingCartItem): void {
    this.shoppingCartService.addToCart(item.product, 1);
    this.refreshShoppingCart();
  }

  decrease(item: ShoppingCartItem): void {
    this.shoppingCartService.removeFromCart(item);
    this.refreshShoppingCart();
  }

  refreshShoppingCart(): void {
    this.shoppingCart = this.shoppingCartService.getCart();
    this.calculateTotalPrice();
  }

  buy(): void {
    localStorage.setItem("pedido", JSON.stringify({
      productos: this.shoppingCart,
      direccion: {},
    }));

    this.router.navigate(["../billing-address"]);
  }

  continueShopping(): void {
    this.router.navigate(["../"]);
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

  hasAnyDiscount(): boolean {
    return this.shoppingCart.some(
      item => typeof item.product.Descuento === 'number' && item.product.Descuento > 0 && item.product.Descuento < 100
    );
  }

  calculateOriginalTotal(): number {
    return this.shoppingCart.reduce((total, item) => {
      return total + item.product.Precio * item.quantity;
    }, 0);
  }

  calculateTotalDiscount(): number {
    let descuentoTotal = 0;

    for (let item of this.shoppingCart) {
      const descuento = item.product.Descuento ?? 0;

      if (descuento > 0 && descuento < 100) {
        const ahorroPorUnidad = item.product.Precio * (descuento / 100);
        descuentoTotal += ahorroPorUnidad * item.quantity;
      }
    }

    return descuentoTotal;
  }

  clearCart(): void {
    this.shoppingCartService.clearCart();
    this.refreshShoppingCart();
  }

  cartIsEmpty(): boolean {
    return this.shoppingCartService.isEmpty();
  }
}
