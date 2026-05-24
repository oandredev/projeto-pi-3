import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// 1. Importa o arquivo JSON diretamente (ajuste o caminho se o arquivo estiver em outra pasta)
import dataMenu from '../../../../backend/data.json';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class Offers {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  // 2. Alimenta a variável com a propriedade "offers" que corrigimos no JSON
  offers = dataMenu.offers;

  constructor(private router: Router) {}

  scrollLeft(): void {
    if (this.carouselTrack) {
      this.carouselTrack.nativeElement.scrollBy({ left: -600, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.carouselTrack) {
      this.carouselTrack.nativeElement.scrollBy({ left: 600, behavior: 'smooth' });
    }
  }

  goToDetails(offerId: string): void { // coloquei como string para testar. Era number, mas o id no JSON é string
    this.router.navigate(['/offer-details', offerId]);
  }
}
