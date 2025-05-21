import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ShoppingCartItem} from '../../models/shopping-cart-item.model';
import {NgClass} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ProductService} from '../../services/product.service';
import {lang} from '../../models/product.model';

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
      Nombre: {es:"", en:"", fr:"", zh:""},
      Precio: 0,
      Caracteristicas: [],
      Imagen: "",
      Descripcion: {es:"", en:"", fr:"", zh:""},
      Color: '',
      Marca: '',
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

  translate: TranslateService = inject(TranslateService);

  productService: ProductService = inject(ProductService);
  imageUrl: string = '';
  async ngOnInit() {
    this.imageUrl = await this.productService.getImageUrl(this.item.product.Imagen)
  }

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

  getTranslatedName():string {
    const language = this.translate.currentLang as lang;
    return this.item.product.Nombre[language] || this.item.product.Nombre['es'];
  }

  getTranslatedDescription():string {
    const language = this.translate.currentLang as lang;
    return this.item.product.Descripcion[language] || this.item.product.Descripcion['es'];
  }
}
