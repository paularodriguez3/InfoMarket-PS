import { Component } from '@angular/core';
import {ProductInfoComponent} from '../../components/product-info/product-info.component';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  standalone: true,
  imports: [
    ProductInfoComponent
  ],
  styleUrl: './wish-list.component.css'
})
export class WishListComponent {

}
