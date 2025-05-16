import {Component, inject, OnInit} from '@angular/core';
import {Feature, Product, Valoracion} from '../../models/product.model';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {Router} from '@angular/router';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {WishListService} from '../../services/wish-list.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  imports: [
    NgIf,
    NgClass,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    TranslatePipe
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
    Stock: 0,
    Valoraciones: []
  };
  cantidad: number = 1;
  precioTotal: number = this.product.Precio;
  shoppingCartService: ShoppingCartService = inject(ShoppingCartService);

  category:string = "";

  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  mostrarModal = false;
  valoracion = 1;
  comentario: string = '';
  puntuacionMedia: number = 0;

  constructor(private router:Router, private firebaseService: ProductService, private wishListService: WishListService) {}

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
    this.product.Valoraciones = history.state.product.Valoraciones || [];

    console.log('Valoraciones antes1 del mapeo:', this.product.Valoraciones);

    this.product.Valoraciones = (this.product.Valoraciones ?? []).map(val => {
      return {
        ...val,
        Fecha: val.Fecha && 'toDate' in val.Fecha
          ? (val.Fecha as any).toDate()
          : new Date((val.Fecha as any).seconds * 1000)
      };
    }).sort((a, b) => {
      const fechaA = a.Fecha ? new Date(a.Fecha).getTime() : 0;
      const fechaB = b.Fecha ? new Date(b.Fecha).getTime() : 0;
      return fechaB - fechaA;
    });

    console.log('Valoraciones después del mapeo:', this.product.Valoraciones);

    this.checkUserRole();
    this.calcularPuntuacionMedia();
    console.log(this.isAdmin);
  }

  decrementQty() {
    if (this.cantidad > 1) {
      this.cantidad--;
      this.precioTotal = Number((this.product.Precio * this.cantidad).toFixed(2));
    }
  }

  incrementQty() {
    if (this.product && this.cantidad < this.product.Stock) {
      this.cantidad++;
    }
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

  trackByIndex(index: number, item: any): number {
    return index;
  }

  mostrarModalValoracion() {
    this.mostrarModal = true;
    this.valoracion = 1;
    this.comentario = '';
  }

  async valorar() {
    if (!this.valoracion) return;

    const nuevaValoracion = {
      Puntuacion: this.valoracion,
      Comentario: this.comentario,
      Fecha: new Date(),
      Usuario: this.obtenerNombreUsuario()
    };

    try {
      console.log(this.product.id);
      if (this.product.id) {
        await this.firebaseService.valorarProducto(
          this.product.id,
          nuevaValoracion,
          this.product.Categoria,
          this.product.Subcategoria
        );
      }

      console.log('Valoraciones antess del mapeo:', this.product.Valoraciones);

      this.firebaseService.getProductById(this.product.Categoria || '', this.product.Subcategoria || '', this.product.id || '')
        .subscribe((updatedProduct) => {
          console.log('Valoraciones antes33 del mapeo:', this.product);
          const caracteristicasUpdated: Feature[] = updatedProduct.Caracteristicas
            ? Object.entries(updatedProduct.Caracteristicas).map(([key, value]) => ({
              name: key,
              value: String(value),
            }))
            : [];

          this.product = {
            ...updatedProduct,
            Caracteristicas: caracteristicasUpdated,
            Valoraciones: (updatedProduct.Valoraciones ?? []).map((val: Valoracion) => ({
              ...val,
              Fecha: val.Fecha instanceof Date
                ? val.Fecha
                : typeof (val.Fecha as any)?.toDate === 'function'
                  ? (val.Fecha as any).toDate()
                  : new Date((val.Fecha as any)?.seconds * 1000)
            })).sort((a, b) => {
              const fechaA = a.Fecha ? new Date(a.Fecha).getTime() : 0;
              const fechaB = b.Fecha ? new Date(b.Fecha).getTime() : 0;
              return fechaB - fechaA;
            }),
          };
          console.log('Valoraciones despuésss33 del mapeo:', this.product);
          this.calcularPuntuacionMedia();
        });

      this.cerrarModal();
    } catch (error) {
      console.error('Error al guardar la valoración:', error);
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  seleccionarEstrella(index: number) {
    this.valoracion = index + 1;
  }

  obtenerNombreUsuario(): string {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).name || 'Anónimo' : 'Anónimo';
  }

  calcularPuntuacionMedia() {
    if (this.product.Valoraciones && this.product.Valoraciones.length > 0) {
      const total = this.product.Valoraciones.reduce((acc, val) => acc + val.Puntuacion, 0);
      this.puntuacionMedia = total / this.product.Valoraciones.length;
    } else {
      this.puntuacionMedia = 0;
    }
  }
}
