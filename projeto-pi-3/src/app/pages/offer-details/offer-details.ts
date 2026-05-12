import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { OffersService } from '../../core/services/offers/offers';
import { UserLoginService } from '../../core/services/userLogin/user-login';
import { CartService } from '../../core/services/cart/cart-service';
import { Offer } from '../../core/types/types';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-offer-details',
  imports: [CommonModule],
  templateUrl: './offer-details.html',
  styleUrl: './offer-details.css',
})
export class OfferDetails implements OnInit {
  /* Vars */
  offer: Offer | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offersService: OffersService,
    private loginService: UserLoginService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.loadOffer(id);
  }

  loadOffer(id: string) {
    this.offersService.getOfferData(id).subscribe((offer: Offer | null) => {
      this.offer = offer;

      if (!this.offer) {
        this.forceRedirection();
      }
    });
  }

  forceRedirection() {
    alert('Algo falhou durante o carregamento. Voltando...');
    this.router.navigate(['/offers']);
  }

  addToCart() {
    this.loginService
      .isLogged()
      .pipe(take(1))
      .subscribe((isLoggedIn) => {
        // Sai silenciosamente se estiver deslogado.
        if (!isLoggedIn) {
          alert('Você não está logado. Faça login para adicionar ao carrinho');
          return;
        }
        this.cartService.addItem(this.offer!).subscribe(() => {
          console.log('Item adicionado!');
        });
      });
  }
}
