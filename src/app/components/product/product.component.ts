import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Product} from '../../models/product.model';
import {Router} from '@angular/router';
import {ShoppingCartService} from '../../services/shopping-cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product!: Product;
  @Input() imageUrl!: string;

  @Output() see = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<void>();

  router: Router = inject(Router);
  shoppingCart: ShoppingCartService = inject(ShoppingCartService);

  onSee() {
    this.router.navigate(['/product-details'], {state: {product: this.product}});
  }

  onAddToCart() {
    this.shoppingCart.addToCart(this.product, 1);
  }
}
