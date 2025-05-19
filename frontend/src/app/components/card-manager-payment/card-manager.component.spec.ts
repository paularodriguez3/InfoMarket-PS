import { ComponentFixture, TestBed } from '@angular/core/testing';

import {CardManagerPaymentComponent} from './card-manager-payment.component';

describe('CardManagerPaymentComponent', () => {
  let component: CardManagerPaymentComponent;
  let fixture: ComponentFixture<CardManagerPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardManagerPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardManagerPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
