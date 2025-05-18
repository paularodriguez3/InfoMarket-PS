import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  DoCheck
} from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ShoppingCartItem } from '../../models/shopping-cart-item.model';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {WishListService} from '../../services/wish-list.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    RouterLink,
    FormsModule,
    NgIf,
    TranslatePipe
  ]
})
export class HeaderComponent implements OnInit, DoCheck {
  @ViewChild('searchBar') searchRef!: ElementRef;
  @ViewChild('inputBar') inputRef!: ElementRef;

  isSearchActive = false;
  wishListCount = 0;
  cartItemCount = 0;
  terminoBusqueda = '';
  isAdmin = false;
  isLoggedIn = false;
  shoppingCart: ShoppingCartItem[] = [];
  langDropdownOpen = false;

  constructor(
    private cartService: ShoppingCartService,
    private wishListService: WishListService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.wishListService.wishListChanged$.subscribe(wishList => {
      this.wishListCount = wishList.length;
    });
    this.wishListService.getWishList().then(products => {
      this.wishListCount = products.length;
    });
    this.shoppingCart = this.cartService.getCart();
    this.cartItemCount = this.shoppingCart.reduce((acc, item) => acc + item.quantity, 0);

    this.checkUserRole();

    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.translate.use(savedLang);
    }

    this.cartService.cartChanged$.subscribe(cart => {
      this.shoppingCart = cart;
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

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.langDropdownOpen = false;
  }

  toggleLangDropdown() {
    this.langDropdownOpen = !this.langDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;

    // Cerrar búsqueda si hace clic fuera
    if (this.searchRef && !this.searchRef.nativeElement.contains(target) && this.isSearchActive) {
      this.searchRef.nativeElement.classList.remove('active');
      this.isSearchActive = false;
    }

    // Cerrar selector de idioma si hace clic fuera
    const dropdownEl = document.querySelector('.lang-dropdown');
    if (dropdownEl && !dropdownEl.contains(event.target as Node)) {
      this.langDropdownOpen = false;
    }
  }
}
