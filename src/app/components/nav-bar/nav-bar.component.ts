import { Component, HostListener } from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

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

  toggleDesktopMenu(): void {
    if (window.innerWidth >= 769) {
      this.isDesktopMenuVisible = !this.isDesktopMenuVisible;

      const main = document.querySelector('main');
      if (main) {
        if (this.isDesktopMenuVisible) {
          main.classList.add('blurred');
        } else {
          main.classList.remove('blurred');
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
