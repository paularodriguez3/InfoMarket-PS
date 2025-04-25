import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShoppingCartService} from './shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: false,
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{
  shoppingCart: any[] = []

  constructor(private shoppingCartService: ShoppingCartService, private router: Router) {}

  ngOnInit(): void{
    this.shoppingCart = this.shoppingCartService.getCart();
  }

  increase(item: any): void {
    this.shoppingCartService.addToCart(item, 1);
    this.refreshShoppingCart();
  }

  decrease(item: any): void {
    this.shoppingCartService.removeFromCart(item);
    this.refreshShoppingCart();
  }

  refreshShoppingCart(): void {
    this.shoppingCart = this.shoppingCartService.getCart();
  }

  buy(): void {
    localStorage.setItem("", JSON.stringify({
      productos: this.shoppingCart,
      direccion: {},
      metodoEnvio: null
    }));
    this.router.navigate(["../billing-address"]);
  }

  continueShopping(): void {
    this.router.navigate(["../home"]); // FIXME
  }
}
