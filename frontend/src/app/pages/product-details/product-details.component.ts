import {Component, inject, OnInit} from '@angular/core';
import {Feature, lang, Product, Valoracion} from '../../models/product.model';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {Router} from '@angular/router';
import {DatePipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {WishListService} from '../../services/wish-list.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

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
    TranslatePipe,
    SlicePipe
  ],
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {
    Nombre : {es:"", en:"", fr:"", zh:""},
    Descripcion : {es:"", en:"", fr:"", zh:""},
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
  productService: ProductService = inject(ProductService);

  category:string = "";

  protected featuresLangs: any = [];

  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  mostrarModal = false;
  valoracion = 1;
  comentario: string = '';
  puntuacionMedia: number = 0;

  editar: boolean = false;

  imageUrl: string = '';
  valorado: boolean = false;

  valoracionesMostradas = 4;

  constructor(
    private router:Router,
    private firebaseService: ProductService,
    private wishListService: WishListService,
    private translate: TranslateService) {}

  async ngOnInit() {
    const producto = history.state.product;
    this.imageUrl = await this.productService.getImageUrl(producto.Imagen);
    if (!producto) {
      this.router.navigate(['/product-list']);
      return;
    }

    this.firebaseService.getProductById(producto.id)
      .subscribe((updatedProduct) => {
        this.featuresLangs = updatedProduct.Caracteristicas;
        /*const caracteristicasUpdated: Feature[] = caracteristicasLang
          ? Object.entries(updatedProduct.Caracteristicas).map(([key, value]) => ({
            name: key,
            value: String(value),
          }))
          : [];*/
        console.log(updatedProduct);

        const currentUserUid = this.obtenerUidUsuario();

        const valoraciones = (updatedProduct.Valoraciones ?? []).map((val: Valoracion) => ({
          ...val,
          Fecha: val.Fecha instanceof Date
            ? val.Fecha
            : typeof (val.Fecha as any)?.toDate === 'function'
              ? (val.Fecha as any).toDate()
              : new Date((val.Fecha as any)?.seconds * 1000)
        }));

        const propias = valoraciones.filter(v => (v as any).uid === currentUserUid);
        const otras = valoraciones.filter(v => (v as any).uid !== currentUserUid)
          .sort((a, b) => b.Fecha.getTime() - a.Fecha.getTime());

        this.product = {
          ...updatedProduct,
          Valoraciones: [...propias, ...otras]
        };
        this.valorado = propias.length > 0;
        this.calcularPuntuacionMedia();
      });

    this.checkUserRole();
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
    if (this.product.Stock > 10) return this.translate.instant('PRODUCT_DETAIL.STOCK_IN');
    if (this.product.Stock > 0) return this.translate.instant('PRODUCT_DETAIL.STOCK_FEW');
    return this.translate.instant('PRODUCT_DETAIL.STOCK_OUT');
  }

  addToWishList() {
    this.wishListService.addToWishList(this.product);
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

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const uid = currentUser?.uid;
    const name = currentUser?.name || 'Anónimo';

    const nuevaValoracion = {
      Puntuacion: this.valoracion,
      Comentario: this.comentario,
      Fecha: new Date(),
      Usuario: name,
      uid: uid
    };

    try {
      if (this.product.id) {
        const yaValorado = this.product.Valoraciones?.some(v => (v as any).uid === uid);
        if (yaValorado) {
          await this.firebaseService.actualizarValoracion(
            this.product.id,
            nuevaValoracion
          );
        } else {
          await this.firebaseService.valorarProducto(
            this.product.id,
            nuevaValoracion
          );
        }
      }

      this.cerrarModal();
    } catch (error) {
      console.error('Error al guardar la valoración:', error);
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  obtenerUidUsuario(): string {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).uid || '' : '';
  }

  editarValoracion(val: Valoracion) {
    this.valoracion = val.Puntuacion;
    this.comentario = val.Comentario;
    this.mostrarModal = true;
    this.editar = true;
  }

  seleccionarEstrella(index: number) {
    this.valoracion = index + 1;
  }

  calcularPuntuacionMedia() {
    if (this.product.Valoraciones && this.product.Valoraciones.length > 0) {
      const total = this.product.Valoraciones.reduce((acc, val) => acc + val.Puntuacion, 0);
      this.puntuacionMedia = total / this.product.Valoraciones.length;
    } else {
      this.puntuacionMedia = 0;
    }
  }

  eliminarValoracion(val: Valoracion) {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta valoración?');
    if (!confirmed) return;

    const uid = this.obtenerUidUsuario();
    const nuevasValoraciones = this.product.Valoraciones?.filter(v => (v as any).uid !== uid);

    this.firebaseService.updateValoraciones(
      this.product.id!,
      nuevasValoraciones ?? []
    ).then(() => {
      this.mostrarModal = false;
    }).catch((err) => {
      console.error('Error al eliminar valoración:', err);
    });
  }

  mostrarMasValoraciones() {
    this.valoracionesMostradas += 4;
  }

  getTranslatedName():string {
    const language = this.translate.currentLang as lang;
    return this.product.Nombre[language] || this.product.Nombre['es'];
  }

  getTranslatedDescription():string {
    const language = this.translate.currentLang as lang;
    return this.product.Descripcion[language] || this.product.Descripcion['es'];
  }

  getTranslatedFeatures(): any[] {
    const language = this.translate.currentLang as lang;
    console.log(this.featuresLangs[language]);
    return this.featuresLangs[language];
  }
}
