import { TestBed } from '@angular/core/testing';

import { ProductPoDialog.ServiceService } from './product-po-dialog.service.service';

describe('ProductPoDialog.ServiceService', () => {
  let service: ProductPoDialog.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductPoDialog.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
