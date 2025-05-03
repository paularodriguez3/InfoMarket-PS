import {Component, inject} from '@angular/core';
import {Feature, Product} from '../../models/product.model';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {Router} from '@angular/router';

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
    Caracteristicas: [],
    id: "",
    Color:'',
    Categoria: '',
    Subcategoria: ''
  };
  cantidad: number = 1;
  precioTotal: number = this.product.Precio;
  shoppingCartService: ShoppingCartService = inject(ShoppingCartService);

  category:string = "";

  constructor(private router:Router) {}

  ngOnInit() {
    this.product.Nombre = history.state.product.Nombre;
    this.product.Descripcion = history.state.product.Descripcion;
    this.product.Imagen = history.state.product.Imagen;
    this.product.Precio = history.state.product.Precio;
    let caracteristicas: Feature[] = [];
    for (let caracteristica in history.state.product.Caracteristicas) {
      const feature: Feature = {
        name: caracteristica,
        value: history.state.product.Caracteristicas[caracteristica]
      };
      caracteristicas.push(feature);
    }
    this.product.id = history.state.product.id;
    this.product.Caracteristicas = caracteristicas;

    this.product.Categoria = history.state.product.Categoria;
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

  editProduct() {
    const productJSON = JSON.stringify({
      product: this.product,
      category: this.category,
    });
    console.log(productJSON);
    localStorage.setItem('edit-product', productJSON);
    this.router.navigate(["../add-product"]);
  }
}
