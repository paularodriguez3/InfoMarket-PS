import { Component } from '@angular/core';
import {ShoppingInfoComponent} from '../../components/shopping-info/shopping-info.component';
import {OrderReviewTemplateComponent} from '../../components/order-review-template/order-review-template.component';
import {ShoppingProcessComponent} from '../shopping-process/shopping-process.component';

@Component({
  selector: 'app-order-review',
  standalone: true,
  templateUrl: './order-review.component.html',
  imports: [
    ShoppingInfoComponent,
    OrderReviewTemplateComponent,
    ShoppingProcessComponent
  ],
  styleUrl: './order-review.component.css'
})
export class OrderReviewComponent {

}
