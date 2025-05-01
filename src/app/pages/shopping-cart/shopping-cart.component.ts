import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {ShoppingCartItem} from '../../models/shopping-cart-item.model';
import {NgFor} from '@angular/common';
import {ProductInfoComponent} from '../../components/product-info/product-info.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    NgFor,
    ProductInfoComponent
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
      metodoEnvio: null
    }));
    this.router.navigate(["../billing-address"]);
  }

  continueShopping(): void {
    this.router.navigate(["../"]);
  }

  calculateTotalPrice(): number {
    let total:number = 0;
    for (let item of this.shoppingCart) {
      total += Number((item.product.Precio * item.quantity).toFixed(2));
    }
    return total;
  }
}
