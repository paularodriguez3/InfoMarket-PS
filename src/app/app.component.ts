import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    NavBarComponent,
    HeaderComponent,
    FooterComponent,
    RouterOutlet
  ]
})
export class AppComponent {
  title = 'InfoMarket-PS';

  constructor(private router: Router, private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');


    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    });
  }
}
