import { TestBed } from '@angular/core/testing';

import { Cnpj } from './cnpj';

describe('Cnpj', () => {
  let service: Cnpj;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cnpj);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
