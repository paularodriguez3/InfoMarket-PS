import { Component } from '@angular/core';
import {ShoppingInfoComponent} from '../../components/shopping-info/shopping-info.component';
import {ShoppingProcessComponent} from '../shopping-process/shopping-process.component';

@Component({
  selector: 'app-billing-address',
  standalone: true,
  templateUrl: './billing-address.component.html',
  imports: [
    ShoppingInfoComponent,
    ShoppingProcessComponent
  ],
  styleUrl: './billing-address.component.css'
})
export class BillingAddressComponent {

}
