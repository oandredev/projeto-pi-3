import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Contém *ngFor, | number

@Component({
  selector: 'app-offers',
  imports: [CommonModule],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class Offers {
  offers = [{ id: 1, name: 'Game Teste', price: 27.0, imageUrl: '/images/teste.jpg' }]; // Trocar pra buscar com a API depois

  constructor(private router: Router) {}

  // Função chamada ao clicar no card da oferta
  goToDetails(offerId: number): void {
    this.router.navigate(['/offer-details', offerId]);
  }
}
