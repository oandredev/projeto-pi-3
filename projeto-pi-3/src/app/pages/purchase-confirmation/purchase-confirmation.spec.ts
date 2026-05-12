import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseConfirmation } from './purchase-confirmation';

describe('PurchaseConfirmation', () => {
  let component: PurchaseConfirmation;
  let fixture: ComponentFixture<PurchaseConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
