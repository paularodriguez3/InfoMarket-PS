import { Component, ElementRef, HostListener, OnInit, ViewChild, DoCheck } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    RouterLink,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {
  @ViewChild('searchBar') searchRef!: ElementRef;
  @ViewChild('inputBar') inputRef!: ElementRef;

  isSearchActive = false;
  cartItemCount = 0;
  terminoBusqueda = '';
  isAdmin = false;

  constructor(
    private cartService: ShoppingCartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartItemCount = this.cartService.getLength();

    this.checkUserRole();

    this.cartService.cartChanged$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngDoCheck() {
    this.checkUserRole();
  }

  checkUserRole() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.isAdmin = user.rol === 'Administrador';
    } else {
      this.isAdmin = false;
    }
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
