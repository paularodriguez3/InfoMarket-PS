import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isDesktopMenuVisible = false;
  isMobileMenuVisible = false;

  toggleDesktopMenu(): void {
    if (window.innerWidth >= 769) {
      this.isDesktopMenuVisible = !this.isDesktopMenuVisible;
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
}
