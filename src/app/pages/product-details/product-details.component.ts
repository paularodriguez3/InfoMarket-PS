import {Component, inject} from '@angular/core';
import {Product} from '../../models/product.model';
import {ShoppingCartService} from '../../services/shopping-cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product: Product = {
    Nombre : "Lavadora multifunción Teka",
    Descripcion : "Lavadora multifunción muy resistente",
    Imagen : "https://th.bing.com/th/id/OIP.gwTG8IIrrG0FeBx3FUJUYAHaKB?rs=1&pid=ImgDetMain",
    Precio : 2000,
    Caracteristicas: ["Lavadora multifunción", "Resistente"]
  };
  cantidad: number = 1;
  shoppingCartService: ShoppingCartService = inject(ShoppingCartService);

  decrementQty() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  incrementQty() {
    this.cantidad++;
  }
}
