import { Component } from '@angular/core';
import {ShoppingProcessComponent} from '../shopping-process/shopping-process.component';
import {ShoppingInfoComponent} from '../../components/shopping-info/shopping-info.component';

@Component({
  selector: 'app-shipping-method',
  standalone: true,
  templateUrl: './shipping-method.component.html',
  imports: [
    ShoppingProcessComponent,
    ShoppingInfoComponent
  ],
  styleUrl: './shipping-method.component.css'
})
export class ShippingMethodComponent {

}
