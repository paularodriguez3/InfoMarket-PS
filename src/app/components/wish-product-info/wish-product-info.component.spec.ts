import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishProductInfoComponent } from './wish-product-info.component';

describe('WishProductInfoComponent', () => {
  let component: WishProductInfoComponent;
  let fixture: ComponentFixture<WishProductInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishProductInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
