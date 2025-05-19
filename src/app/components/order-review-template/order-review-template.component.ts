// src/app/components/order-review-template/order-review-template.component.ts

import { Component, Input } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-order-review-template',
  templateUrl: './order-review-template.component.html',
  imports: [
    TranslatePipe
  ],
  standalone: true,
  styleUrls: ['./order-review-template.component.css']
})
export class OrderReviewTemplateComponent {
  @Input() paymentMethod: string = '';
  @Input() arrivalDate: string = '';
}
