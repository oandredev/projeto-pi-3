import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OffersService } from '../../core/services/offers/offers';
import { Offer } from '../../core/types/types';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class Offers implements OnInit, OnDestroy {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  offers: Offer[] = [];

  heroSlide = 0;
  featuredSlide = 0;

  private heroInterval: any;
  private featuredInterval: any;

  constructor(
    private offersService: OffersService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.offersService.getAllOffers().subscribe((data) => {
      this.offers = data;
      this.startHeroAutoPlay();
      this.startFeaturedAutoPlay();
    });
  }

  ngOnDestroy(): void {
    this.stopHeroAutoPlay();
    this.stopFeaturedAutoPlay();
  }

  scrollLeft(): void {
    this.carouselTrack?.nativeElement.scrollBy({ left: -600, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.carouselTrack?.nativeElement.scrollBy({ left: 600, behavior: 'smooth' });
  }

  goToDetails(offerId: string | undefined): void {
    if (!offerId) return;
    this.router.navigate(['/offer-details', offerId]);
  }

  // Hero
  nextHeroSlide(): void {
    this.heroSlide = (this.heroSlide + 1) % 3;
  }
  prevHeroSlide(): void {
    this.heroSlide = (this.heroSlide - 1 + 3) % 3;
  }
  goToHeroSlide(i: number): void {
    this.heroSlide = i;
  }
  startHeroAutoPlay(): void {
    this.heroInterval = setInterval(() => this.nextHeroSlide(), 5000);
  }
  stopHeroAutoPlay(): void {
    clearInterval(this.heroInterval);
  }

  // Featured
  nextFeaturedSlide(): void {
    this.featuredSlide = (this.featuredSlide + 1) % 8;
  }
  prevFeaturedSlide(): void {
    this.featuredSlide = (this.featuredSlide - 1 + 8) % 8;
  }
  goToFeaturedSlide(i: number): void {
    this.featuredSlide = i;
  }
  startFeaturedAutoPlay(): void {
    this.featuredInterval = setInterval(() => this.nextFeaturedSlide(), 4000);
  }
  stopFeaturedAutoPlay(): void {
    clearInterval(this.featuredInterval);
  }
}
