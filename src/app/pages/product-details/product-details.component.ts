import {Component, inject, OnInit} from '@angular/core';
import {Feature, Product} from '../../models/product.model';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {Router} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {WishListService} from '../../services/wish-list.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  imports: [
    NgIf,
    NgClass
  ],
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {
    Nombre : "",
    Descripcion : "",
    Imagen : "",
    Precio : 0,
    Caracteristicas: [],
    id: "",
    Color:'',
    Categoria: '',
    Subcategoria: '',
    Descuento: 0,
    Stock: 0
  };
  cantidad: number = 1;
  precioTotal: number = this.product.Precio;
  shoppingCartService: ShoppingCartService = inject(ShoppingCartService);

  category:string = "";

  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private router:Router, private wishListService: WishListService) {}

  ngOnInit() {
    this.product.Nombre = history.state.product.Nombre;
    this.product.Descripcion = history.state.product.Descripcion;
    this.product.Imagen = history.state.product.Imagen;
    this.product.Precio = history.state.product.Precio;
    this.product.Descuento = history.state.product.Descuento;
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
    this.product.Subcategoria = history.state.product.Subcategoria;
    this.product.Stock = history.state.product.Stock;

    this.checkUserRole();
    console.log(this.isAdmin);
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

  ngDoCheck() {
    // Este método se ejecutará cada vez que Angular realice una verificación de cambios
    // Aquí puedes verificar si el usuario cambió (por ejemplo, si hizo login o logout)
    this.checkUserRole();
  }

  checkUserRole() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.isAdmin = user.rol === 'Administrador';
      this.isLoggedIn = true;
    } else {
      this.isAdmin = false;
      this.isLoggedIn = false;
    }
  }

  getPrecioConDescuento(): number {
    const descuento = this.product.Descuento ?? 0;
    if (descuento > 0 && descuento < 100) {
      return Number((this.product.Precio * (1 - descuento / 100)).toFixed(2));
    }
    return this.product.Precio;
  }

  getStockMessage(): string {
    if (this.product.Stock > 10) return 'Con existencias';
    if (this.product.Stock > 0) return 'Últimas unidades';
    return 'Sin stock';
  }

  addToWishList() {
    this.wishListService.addToWishList(this.product);
    alert("Producto añadido a la lista de deseos");
  }
}
