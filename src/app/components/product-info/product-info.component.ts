import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ShoppingCartItem} from '../../models/shopping-cart-item.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-product-info',
  imports: [
    NgClass
  ],
  templateUrl: './product-info.component.html',
  standalone: true,
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {
  @Input() item: ShoppingCartItem = {
    product: {
      Nombre:"",
      Precio:0,
      Caracteristicas:[] ,
      Imagen:"",
      Descripcion:"",
      Color:'',
      Categoria:'',
      Subcategoria:''
    },
    quantity:0};
  @Input() showButtons: boolean = false;
  @Output() increaseQty: EventEmitter<any> = new EventEmitter();
  @Output() decreaseQty: EventEmitter<any> = new EventEmitter();

  increase() {
    this.increaseQty.emit(this.item);
  }

  decrease() {
    this.decreaseQty.emit(this.item);
  }

  getPrice() {
    return Number((this.item.product.Precio * this.item.quantity).toFixed(2));
  }
}
