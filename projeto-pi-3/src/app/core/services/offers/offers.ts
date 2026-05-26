import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Offer } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  // APIs
  private offerAPI = `http://localhost:3000/offers`;

  constructor(private http: HttpClient) {}

  getOfferData(offerId: string) {
    return this.http.get<Offer[]>(this.offerAPI).pipe(
      map((offers) => {
        return offers.find((o) => o.id === offerId) || null;
      }),
    );
  }

  getAllOffers() {
    return this.http.get<Offer[]>(this.offerAPI);
  }
}
