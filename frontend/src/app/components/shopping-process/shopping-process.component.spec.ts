import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingProcessComponent } from './shopping-process.component';

describe('ShoppingProcessComponent', () => {
  let component: ShoppingProcessComponent;
  let fixture: ComponentFixture<ShoppingProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
