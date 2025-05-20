import { TestBed } from '@angular/core/testing';

import { TranslateProductService } from './translate-product.service';

describe('TranslateProductService', () => {
  let service: TranslateProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
