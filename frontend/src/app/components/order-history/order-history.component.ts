import {Component, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

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
  translate: TranslateService = inject(TranslateService);
}
