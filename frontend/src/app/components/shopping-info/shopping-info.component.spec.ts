import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingInfoComponent } from './shopping-info.component';

describe('ShoppingInfoComponent', () => {
  let component: ShoppingInfoComponent;
  let fixture: ComponentFixture<ShoppingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingInfoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ShoppingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
