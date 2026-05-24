import { TestBed } from '@angular/core/testing';

import { CEP } from './cep';

describe('CEP', () => {
  let service: CEP;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CEP);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
