import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressManagerComponent } from './address-manager.component';

describe('AddressManagerComponent', () => {
  let component: AddressManagerComponent;
  let fixture: ComponentFixture<AddressManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
