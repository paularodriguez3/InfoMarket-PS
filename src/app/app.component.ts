import { Component } from '@angular/core';
import {filter} from 'rxjs';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NavBarComponent,
    HeaderComponent,
    RouterOutlet,
    FooterComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'InfoMarket-PS';
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    });
  }
}
