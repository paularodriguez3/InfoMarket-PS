import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {lang, Product} from '../../models/product.model';
import {Router} from '@angular/router';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {DecimalPipe, NgClass, NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    DecimalPipe,
    NgIf,
    NgClass,
    TranslatePipe
  ],
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
  translate: TranslateService = inject(TranslateService);

  onSee() {
    //console.log(this.product);
    //console.log(this.imageUrl);
    this.router.navigate(['/product-details'], {state: {product: this.product, imageUrl: this.imageUrl}});
  }

  onAddToCart() {
    this.shoppingCart.addToCart(this.product, 1);
  }

  getPrecioConDescuento(product: Product): number {
    if (product.Descuento &&
      product.Descuento > 0 &&
      product.Descuento < 100) {
      return product.Precio * (1 - product.Descuento / 100);
    }
    return product.Precio;
  }

  getTranslatedName():string {
    const language = this.translate.currentLang as lang;
    return this.product.Nombre[language] || this.product.Nombre['es'];
  }

  getTranslatedDescription():string {
    const language = this.translate.currentLang as lang;
    return this.product.Descripcion[language] || this.product.Descripcion['es'];
  }
}
