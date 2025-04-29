import { Component, Input, Output, EventEmitter } from '@angular/core';
import {ShoppingCartItem} from '../../models/shopping-cart-item.model';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {
  @Input() item: ShoppingCartItem = {product:{Nombre:"", Precio:0, Caracteristicas:[] , Imagen:"", Descripcion:""}, quantity:0};
  @Input() showButtons: boolean = false;
  @Output() increaseQty: EventEmitter<any> = new EventEmitter();
  @Output() decreaseQty: EventEmitter<any> = new EventEmitter();

  increase() {
    this.increaseQty.emit(this.item);
  }

  decrease() {
    this.decreaseQty.emit(this.item);
  }
}
