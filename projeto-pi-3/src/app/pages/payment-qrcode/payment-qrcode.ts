import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-qrcode',
  imports: [RouterModule],
  templateUrl: './payment-qrcode.html',
  styleUrl: './payment-qrcode.css',
})
export class PaymentQRCode {
  constructor(private router: Router) {}
}
