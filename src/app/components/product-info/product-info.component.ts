import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-info',
  standalone: false,
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {
  @Input() item: any;
  @Output() increaseQty: EventEmitter<any> = new EventEmitter();
  @Output() decreaseQty: EventEmitter<any> = new EventEmitter();

  increase() {
    this.increaseQty.emit(this.item);
  }

  decrease() {
    this.decreaseQty.emit(this.item);
  }
}
