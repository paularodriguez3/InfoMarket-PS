import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-client-support',
  standalone: true,
  templateUrl: './client-support.component.html',
  imports: [
    TranslatePipe
  ],
  styleUrl: './client-support.component.css'
})
export class ClientSupportComponent {

}
