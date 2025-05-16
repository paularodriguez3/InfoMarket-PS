/* TODO: !!!!!!!!!!!!!!!!!!!!
 * TODO: Revisar que las funcionalidades de añadir, editar y eliminar producto funcionan
 * TODO: Si no funcionan, arreglarlas.
 * TODO: !!!!!!!!!!!!!!!!!!!!
 **/

import {Component, OnInit, HostListener, OnDestroy} from '@angular/core';
import { ProductComponent } from '../../components/product/product.component';
import {NgClass, NgForOf} from '@angular/common';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import {combineLatest, Subscription} from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  imports: [
    ProductComponent,
    NgForOf,
    FormsModule,
    NgClass
  ],
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  titulo = '';
  categoria: string = '';
  private routeSub!: Subscription;
  private dataSub!: Subscription;

  isFilterMenuVisible = false;

  precioMin: number | null = null;
  precioMax: number | null = null;
  marca: string = '';
  color: string = '';
  caracteristicas: { [key: string]: string } = {};
  ordenSeleccionado: string = '';

  filtrosCategoria: { [key: string]: string[] } = {
    Lavadora: ['Tamaño del tambor', 'Eficiencia energética', 'Conexión Wi-Fi'],
    Ordenador: ['Memoria RAM', 'Tarjeta gráfica', 'Procesador', 'Tarjeta de red']
  };

  subcategoriaNombres: { [key: string]: string } = {
    'PC': 'PC sobremesa',
    'Portatiles': 'Portátiles',
    'Teclado': 'Teclados',
    'Raton': 'Ratones',
    'Cascos y auriculares': 'Cascos y auriculares'
  };

  isLoading = false;
  pageNumber = 0;
  pageSize = 6;
  lastDoc: any = null;

  search: string|null = null;
  categoriaParam: string| null = null;
  subcategoriaParam: string|null = null;
  discounts: boolean|null = null;

  whereParam: string[] = [];
  orderParam: string|null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.routeSub = combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ]).subscribe(([params, queryParams]) => {
      this.search = queryParams.get('search');
      this.categoriaParam = params.get('categoria');
      this.subcategoriaParam = params.get('subcategoria');
      this.discounts = queryParams.get('ofertas') === 'true';


      if (this.dataSub) this.dataSub.unsubscribe();
      this.products = [];
      this.filteredProducts =  [];

      if (this.discounts) {
        this.whereParam.push(`Descuento > 0`);
        this.whereParam.push(`Descuento < 100`);
      }
      if (this.categoriaParam) this.whereParam.push(`Categoria == ${this.categoriaParam}`);
      if (this.subcategoriaParam) this.whereParam.push(`Subategoria == ${this.subcategoriaParam}`);

      this.loadNextPage();
    });

    // TEMPORAL:
    // this.productService.copiarProductos()
  }

  toggleFilterMenu() {
    this.isFilterMenuVisible = !this.isFilterMenuVisible;
    console.log('isFilterMenuVisible:', this.isFilterMenuVisible);
  }

  aplicarFiltros() {
    this.whereParam = [];
    if (this.discounts) {
      this.whereParam.push(`Descuento > 0`);
      this.whereParam.push(`Descuento < 100`);
    }
    if (this.categoriaParam) this.whereParam.push(`Categoria == ${this.categoriaParam}`);
    if (this.subcategoriaParam) this.whereParam.push(`Subategoria == ${this.subcategoriaParam}`);

    if (this.precioMin) this.whereParam.push(`Precio >= ${this.precioMin}`);
    if (this.precioMax) this.whereParam.push(`Precio <= ${this.precioMax}`);

    if (this.marca) this.whereParam.push(`Marca == ${this.marca.charAt(0).toUpperCase() + this.marca.slice(1)}`);

    if (this.color) this.whereParam.push(`Color == ${this.color.charAt(0).toUpperCase() + this.color.slice(1)}`);

    this.aplicarOrdenacion();
    this.reloadProducts();
    this.isFilterMenuVisible = false;
  }

  aplicarOrdenacion() {
    switch (this.ordenSeleccionado) {
      case 'precioAsc':
        this.orderParam = "Precio";
        break;
      case 'precioDesc':
        this.orderParam = "Precio desc";
        break;
      case 'nombreAsc':
        this.orderParam = "Nombre";
        break;
      case 'nombreDesc':
        this.orderParam = "Nombre desc";
        break;
    }
  }

  onSee(product: Product) {
    localStorage.setItem("productoSeleccionado", JSON.stringify({ id: product.id, data: product, quantity: null }));
    this.router.navigate(['/product-details']);
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    setTimeout(() => {
      const target = event.target as HTMLElement;
      const clickedInside = target.closest('#filter-menu-wrapper') || target.closest('#filter-button');
      if (!clickedInside && this.isFilterMenuVisible) {
        this.isFilterMenuVisible = false;
      }
    }, 0);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const scrollPercent = scrollPosition / pageHeight * 100;
    if (scrollPercent >= 60 && !this.isLoading) {
      this.loadNextPage();
    }
  }

  private loadProductsBySearch(search: string) {
    this.titulo = `Resultados de búsqueda: "${search}"`;
    this.isLoading = true;

    // TODO: parámetro de búsqueda
    //this.dataSub = this.productService.getAllProductsRealtime().subscribe(async productos => {
    this.dataSub = this.productService.getProductsLazy(
      this.pageSize,
      this.orderParam,
      this.whereParam,
      this.lastDoc
    ).subscribe(async productos => {
      const filtered: Product[] = [];

      for (const data of productos.data) {
        const imageUrl = await this.productService.getImageUrl(data.Imagen);
        filtered.push({ id: data.id, ...data, Imagen: imageUrl });
      }

      this.filteredProducts.push(...filtered);
      this.lastDoc = productos.lastDoc;
      this.isLoading = false;
    });
  }

  private loadProductsByDiscounts() {
    this.titulo = 'Productos en oferta';
    this.isLoading = true;

    this.dataSub = this.productService.getProductsLazy(
      this.pageSize,
      this.orderParam,
      this.whereParam,
      this.lastDoc
    ).subscribe(async prodData => {
      const filtered: Product[] = [];

      for (const data of prodData.data) {
        const imageUrl = await this.productService.getImageUrl(data.Imagen);
        filtered.push({ id:data.id, ...data, Imagen: imageUrl });
      }
      this.filteredProducts.push(...filtered);
      this.lastDoc = prodData.lastDoc;
      this.isLoading = false;
    });
  }

  private loadProductsByCategory(categoriaParam: string, subcategoriaParam?: string | null) {
    this.categoria = categoriaParam;
    this.isLoading = true;

    this.dataSub = this.productService.getProductsLazy(
      this.pageSize,
      this.orderParam,
      this.whereParam,
      this.lastDoc
    ).subscribe(async doc => {
      const loaded: Product[] = [];

      for (const data of doc.data) {
        const imageUrl = await this.productService.getImageUrl(data.Imagen);
        loaded.push({ id: data.id, ...data, Imagen: imageUrl });
      }

      this.filteredProducts.push(...loaded);
      this.lastDoc = doc.lastDoc;
      this.isLoading = false;
      });
  }

  loadProducts() {
    if (this.search) {
      // this.loadProductsBySearch(this.search);
    } else if (this.discounts) {
      this.loadProductsByDiscounts();
    } else if (this.categoriaParam) {
      this.loadProductsByCategory(this.categoriaParam, this.subcategoriaParam);
    }
  }

  loadNextPage() {
    if (this.lastDoc == null && this.pageNumber > 0) return;
    this.pageNumber++;
    this.loadProducts();
  }

  reloadProducts() {
    this.pageNumber = 0;
    this.filteredProducts = [];
    this.lastDoc = null
    this.loadNextPage();
  }
}
