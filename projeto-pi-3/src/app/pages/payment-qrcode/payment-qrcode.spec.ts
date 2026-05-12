import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentQRCode } from './payment-qrcode';

describe('PaymentQRCode', () => {
  let component: PaymentQRCode;
  let fixture: ComponentFixture<PaymentQRCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentQRCode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentQRCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
