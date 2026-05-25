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
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-details.html',
  styleUrl: './offer-details.css',
})
export class OfferDetails implements OnInit {
  offer: Offer | null = null;
  alreadyBought = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offersService: OffersService,
    private loginService: UserLoginService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.loadOffer(id);
  }

  loadOffer(id: string): void {
    this.offersService.getOfferData(id).subscribe((offer: Offer | null) => {
      this.offer = offer;

      if (!this.offer) {
        alert('Oferta não encontrada.');
        this.router.navigate(['/offers']);
        return;
      }

      this.loginService
        .getLoggedUser()
        .pipe(take(1))
        .subscribe((user) => {
          if (!user?.id) return;

          this.cartService
            .userAlreadyBoughtGame(user.id, id)
            .pipe(take(1))
            .subscribe((bought) => {
              this.alreadyBought = bought;
            });
        });
    });
  }

  addToCart(): void {
    if (!this.offer) return;

    this.loginService
      .isLogged()
      .pipe(take(1))
      .subscribe((isLoggedIn) => {
        if (!isLoggedIn) {
          alert('Você precisa fazer login para adicionar ao carrinho.');
          this.router.navigate(['/login']);
          return;
        }

        this.cartService.addItem(this.offer!).subscribe({
          next: () => {
            alert('Jogo adicionado ao carrinho!');
            this.router.navigate(['/cart']);
          },
          error: (err) => {
            alert(err.message || 'Erro ao adicionar ao carrinho.');
          },
        });
      });
  }

  goBack(): void {
    this.router.navigate(['/offers']);
  }
}
