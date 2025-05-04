import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ShoppingCartService} from '../../services/shopping-cart.service';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    RouterLink,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchBar') searchRef!: ElementRef;
  @ViewChild('inputBar') inputRef!: ElementRef;

  isSearchActive = false;

  cartItemCount = 0;
  terminoBusqueda = '';

  constructor(private cartService: ShoppingCartService, private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.cartItemCount = this.cartService.getLength();

    this.cartService.cartChanged$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  toggleSearch(): void {
    const searchEl = this.searchRef.nativeElement as HTMLElement;
    const inputEl = this.inputRef.nativeElement as HTMLInputElement;

    if (this.isSearchActive) {
      searchEl.classList.remove('active');
      inputEl.blur();
    } else {
      searchEl.classList.add('active');
      setTimeout(() => inputEl.focus(), 50);
    }

    this.isSearchActive = !this.isSearchActive;
  }

  buscarProducto() {
    if (!this.terminoBusqueda.trim()) return;

    this.router.navigate(['/product-list'], {
      queryParams: { search: this.terminoBusqueda }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const searchEl = this.searchRef.nativeElement as HTMLElement;
    const target = event.target as Node;

    if (!searchEl.contains(target) && this.isSearchActive) {
      searchEl.classList.remove('active');
      this.isSearchActive = false;
    }
  }
}
