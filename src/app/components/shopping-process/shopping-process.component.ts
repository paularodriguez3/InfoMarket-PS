import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-shopping-process',
  standalone: true,
  templateUrl: './shopping-process.component.html',
  imports: [
    NgClass
  ],
  styleUrls: ['./shopping-process.component.css']
})
export class ShoppingProcessComponent implements OnInit {

  currentStep: number = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url;

    if (url.includes('billing-address')) {
      this.currentStep = 1;
    } else if (url.includes('payment-method')) {
      this.currentStep = 2;
    } else if (url.includes('order-review')) {
      this.currentStep = 3;
    }
  }
}
