import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('searchBar') searchRef!: ElementRef;
  @ViewChild('inputBar') inputRef!: ElementRef;

  isSearchActive = false;

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
