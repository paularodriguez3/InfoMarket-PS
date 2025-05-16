import { Component, ElementRef, HostListener, OnInit, ViewChild, DoCheck } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';
import {ShoppingCartItem} from '../../models/shopping-cart-item.model';
import {AuthService} from '../../services/auth.service';

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
  isLoggedIn = false;
  shoppingCart: ShoppingCartItem[] = [];

  constructor(
    private cartService: ShoppingCartService,
    private router: Router,
  private authService: AuthService
  ) {}

  ngOnInit() {
    this.shoppingCart = this.cartService.getCart();

    this.cartItemCount = this.shoppingCart.reduce((acc, item) => acc + item.quantity, 0);

    this.checkUserRole();

    this.cartService.cartChanged$.subscribe(cart => {
      this.shoppingCart = cart; // cart es un array de ShoppingCartItem
      this.cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
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
      this.isLoggedIn = true;
    } else {
      this.isAdmin = false;
      this.isLoggedIn = false;
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

  async irAlPerfil() {
    const localData = localStorage.getItem('user');
    const firebaseUser = this.authService.getCurrentUser();

    if (!firebaseUser || !firebaseUser.emailVerified || !localData) {
      localStorage.removeItem('user');
      this.router.navigate(['/sign-in']);
      return;
    }

    this.router.navigate(['/personal-profile']);
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
