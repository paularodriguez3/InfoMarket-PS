import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  templateUrl: './about-us.component.html',
  imports: [
    TranslatePipe
  ],
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {

}
