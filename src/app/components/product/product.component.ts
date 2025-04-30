import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from '../../models/product.model';

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

  onSee() {
    this.see.emit();
  }

  onAddToCart() {
    this.addToCart.emit();
  }
}
