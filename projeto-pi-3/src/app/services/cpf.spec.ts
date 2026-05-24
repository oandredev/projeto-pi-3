import { TestBed } from '@angular/core/testing';

import { Cpf } from './cpf';

describe('Cpf', () => {
  let service: Cpf;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cpf);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
