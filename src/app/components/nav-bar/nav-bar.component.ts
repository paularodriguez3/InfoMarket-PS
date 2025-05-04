import { Component, HostListener } from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    NgIf
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isDesktopMenuVisible = false;
  isMobileMenuVisible = false;
  isScrolling = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isDesktopMenuVisible = false;
        this.isMobileMenuVisible = false;

        document.querySelector('main')?.classList.remove('blurred');
        document.querySelector('footer')?.classList.remove('blurred');
      }
    });
  }

  toggleDesktopMenu(): void {
    if (window.innerWidth >= 769) {
      this.isDesktopMenuVisible = !this.isDesktopMenuVisible;

      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      if (main) {
        if (this.isDesktopMenuVisible) {
          main.classList.add('blurred');
        } else {
          main.classList.remove('blurred');
        }
      }

      if (footer) {
        if (this.isDesktopMenuVisible) {
          footer.classList.add('blurred');
        } else {
          footer.classList.remove('blurred');
        }
      }
    }
  }


  toggleMobileMenu(): void {
    if (window.innerWidth < 769) {
      this.isMobileMenuVisible = !this.isMobileMenuVisible;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 769) {
      this.isMobileMenuVisible = false;
    } else {
      this.isDesktopMenuVisible = false;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolling = window.scrollY > 0;
  }
}
