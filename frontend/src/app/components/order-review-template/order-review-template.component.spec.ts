import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReviewTemplateComponent } from './order-review-template.component';

describe('OrderReviewTemplateComponent', () => {
  let component: OrderReviewTemplateComponent;
  let fixture: ComponentFixture<OrderReviewTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderReviewTemplateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderReviewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
