import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { OffersService } from '../../core/services/offers/offers';
import { UserLoginService } from '../../core/services/userLogin/user-login';
import { HistoryService } from '../../core/services/history/history-service';
import { History, Offer } from '../../core/types/types';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library implements OnInit {
  offers: Offer[] = [];

  constructor(
    private offersService: OffersService,
    private loginService: UserLoginService,
    private historyService: HistoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginService
      .getLoggedUser()
      .pipe(take(1))
      .subscribe((user) => {
        if (!user?.id) return;

        forkJoin({
          offers: this.offersService.getAllOffers(),
          history: this.historyService.getHistoryByUser(),
        }).subscribe(({ offers, history }) => {
          const boughtIds = new Set(
            history.flatMap(
              (entry: History) => entry.cart?.items?.map((item) => item.offer?.id) ?? [],
            ),
          );

          this.offers = offers.filter((offer) => boughtIds.has(offer.id));
        });
      });
  }

  goToDetails(offerId: string | undefined): void {
    if (!offerId) return;
    this.router.navigate(['/offer-details', offerId]);
  }
}
