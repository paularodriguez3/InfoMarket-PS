import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-wish-product-info',
  standalone: true,
  templateUrl: './wish-product-info.component.html',
  styleUrls: ['./wish-product-info.component.css'],
  imports: [
    NgClass
  ]
})
export class WishProductInfoComponent {
  @Input() product!: Product;
  @Input() quantity: number = 0;

  // Nuevo Output para emitir el evento de eliminar
  @Output() removeProduct = new EventEmitter<string>();

  getPrice(): number {
    const descuento = this.product.Descuento ?? 0;
    const precioUnitario = descuento > 0 && descuento < 100
      ? this.product.Precio * (1 - descuento / 100)
      : this.product.Precio;

    return Number(precioUnitario.toFixed(2));
  }

  hasDiscount(): boolean {
    const descuento = this.product.Descuento;
    return typeof descuento === 'number' && descuento > 0 && descuento < 100;
  }

  onRemove() {
    this.removeProduct.emit(this.product.id);
  }
}
