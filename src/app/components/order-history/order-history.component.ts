import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-order-history',
  imports: [
    NgForOf,
    NgIf,
    TranslatePipe
  ],
  standalone: true,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
  @Input() orders!: any[];

  ngOnInit() {
  }

  print() {
    console.log(this.orders);
  }

}
