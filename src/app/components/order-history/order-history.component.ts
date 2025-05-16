import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-order-history',
  imports: [
    NgForOf,
    NgIf
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
