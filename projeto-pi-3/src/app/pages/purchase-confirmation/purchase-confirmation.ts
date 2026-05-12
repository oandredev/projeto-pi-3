import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-purchase-confirmation',
  templateUrl: './purchase-confirmation.html',
  styleUrls: ['./purchase-confirmation.css'],
  imports: [RouterModule],
})
export class PurchaseConfirmation {
  constructor(private router: Router) {}
}
