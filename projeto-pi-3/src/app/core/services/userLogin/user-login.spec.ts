import { TestBed } from '@angular/core/testing';

import { UserLoginService } from './user-login';

describe('UserLogin', () => {
  let service: UserLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
