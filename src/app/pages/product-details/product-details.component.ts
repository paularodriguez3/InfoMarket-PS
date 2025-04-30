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
    Nombre : "",
    Descripcion : "",
    Imagen : "",
    Precio : 0,
    Caracteristicas: []
  };
  cantidad: number = 1;
  precioTotal: number = this.product.Precio;
  shoppingCartService: ShoppingCartService = inject(ShoppingCartService);

  ngOnInit() {
    this.product.Nombre = history.state.product.Nombre;
    this.product.Descripcion = history.state.product.Descripcion;
    this.product.Imagen = history.state.product.Imagen;
    this.product.Precio = history.state.product.Precio;
    let caracteristicas: string[] = [];
    for (let caracteristica in history.state.product.Caracteristicas) {
      const carString: string = caracteristica + ": " + history.state.product.Caracteristicas[caracteristica];
      caracteristicas.push(carString);
    }
    this.product.Caracteristicas = caracteristicas;
  }

  decrementQty() {
    if (this.cantidad > 1) {
      this.cantidad--;
      this.precioTotal = Number((this.product.Precio * this.cantidad).toFixed(2));
    }
  }

  incrementQty() {
    this.cantidad++;
    this.precioTotal = Number((this.product.Precio * this.cantidad).toFixed(2));
  }
}
