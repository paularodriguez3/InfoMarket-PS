import { Component, OnInit, HostListener } from '@angular/core';
import { ProductComponent } from '../../components/product/product.component';
import {NgClass, NgForOf} from '@angular/common';
import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  titulo = '';
  categoria: string = '';

  isFilterMenuVisible = false;

  precioMin: number | null = null;
  precioMax: number | null = null;
  marca: string = '';
  caracteristicas: { [key: string]: string } = {};
  ordenSeleccionado: string = '';

  filtrosCategoria: { [key: string]: string[] } = {
    Lavadora: ['Tamaño del tambor', 'Eficiencia energética', 'Conexión Wi-Fi'],
    Ordenador: ['Memoria RAM', 'Tarjeta gráfica', 'Procesador', 'Tarjeta de red']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  async ngOnInit(): Promise<void> {
    const categoriaParam = this.route.snapshot.paramMap.get('categoria');
    if (!categoriaParam) return;

    this.categoria = categoriaParam;

    const doc = await this.productService.readDoc('productos', this.categoria);
    this.titulo = doc.Nombre;

    const productos = await this.productService.getCategory(this.categoria);
    for (const [id, productoData] of Object.entries(productos)) {
      const data = productoData as Product;
      const imageUrl = await this.productService.getImageUrl(data.Imagen);
      this.products.push({ id, ...data, Imagen: imageUrl });
    }

    this.filteredProducts = [...this.products];
  }

  toggleFilterMenu() {
    this.isFilterMenuVisible = !this.isFilterMenuVisible;
    console.log('isFilterMenuVisible:', this.isFilterMenuVisible);
  }


  aplicarFiltros() {
    this.filteredProducts = this.products.filter(product => {
      const precio = Number(product.Precio);
      const cumplePrecioMin = this.precioMin == null || precio >= this.precioMin;
      const cumplePrecioMax = this.precioMax == null || precio <= this.precioMax;
      const cumpleMarca = this.marca === '' || (product.Marca ?? '').toLowerCase().includes(this.marca.toLowerCase());

      let cumpleCaracteristicas = true;
      for (const clave in this.caracteristicas) {
        const valorFiltro = this.caracteristicas[clave].toLowerCase();
        if (valorFiltro) {
          const caracteristicasLower = product.Caracteristicas.map(c => c.toLowerCase());
          if (!caracteristicasLower.some(caracteristica => caracteristica.includes(valorFiltro))) {
            cumpleCaracteristicas = false;
            break;
          }
        }
      }

      return cumplePrecioMin && cumplePrecioMax && cumpleMarca && cumpleCaracteristicas;
    });

    this.aplicarOrdenacion();
    this.isFilterMenuVisible = false;
  }

  aplicarOrdenacion() {
    switch (this.ordenSeleccionado) {
      case 'precioAsc':
        this.filteredProducts.sort((a, b) => a.Precio - b.Precio);
        break;
      case 'precioDesc':
        this.filteredProducts.sort((a, b) => b.Precio - a.Precio);
        break;
      case 'nombreAsc':
        this.filteredProducts.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
        break;
      case 'nombreDesc':
        this.filteredProducts.sort((a, b) => b.Nombre.localeCompare(a.Nombre));
        break;
    }
  }

  onSee(product: Product) {
    localStorage.setItem("productoSeleccionado", JSON.stringify({ id: product.id, data: product, quantity: null }));
    this.router.navigate(['/product-details']);
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
}
