import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ShoppingCartItem} from '../../models/shopping-cart-item.model';
import {NgClass} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-product-info',
  imports: [
    NgClass,
    TranslatePipe
  ],
  templateUrl: './product-info.component.html',
  standalone: true,
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {
  @Input() item: ShoppingCartItem = {
    product: {
      Nombre: "",
      Precio: 0,
      Caracteristicas: [],
      Imagen: "",
      Descripcion: "",
      Color: '',
      Categoria: '',
      Subcategoria: '',
      Stock: 0
    },
    quantity: 0
  };
  @Input() showButtons: boolean = false;
  @Output() increaseQty: EventEmitter<any> = new EventEmitter();
  @Output() decreaseQty: EventEmitter<any> = new EventEmitter();
  @Output() removeItem: EventEmitter<any> = new EventEmitter();

  increase() {
    this.increaseQty.emit(this.item);
  }

  decrease() {
    this.decreaseQty.emit(this.item);
  }

  remove() {
    this.removeItem.emit(this.item);
  }

  getPrice(): number {
    const descuento = this.item.product.Descuento ?? 0;

    const precioUnitario = descuento > 0 && descuento < 100
      ? this.item.product.Precio * (1 - descuento / 100)
      : this.item.product.Precio;

    return Number((precioUnitario * this.item.quantity).toFixed(2));
  }

  hasDiscount(): boolean {
    const descuento = this.item.product.Descuento;
    return typeof descuento === 'number' && descuento > 0 && descuento < 100;
  }
}
