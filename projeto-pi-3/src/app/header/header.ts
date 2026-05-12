import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../core/services/userLogin/user-login';
import { CartService } from '../core/services/cart/cart-service';
import { User } from '../core/types/types';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [RouterModule],
})
export class Header implements OnInit {
  private loggedUser: User | null = null;
  cartCounter: string = '0';

  constructor(
    private loginService: UserLoginService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    /* CART */
    this.cartService.cartCounter.subscribe((value) => {
      console.log('Quantidade:', value);
      this.cartCounter = value;
    });

    /* USER  */
    this.loginService._loggedUser.subscribe((user) => {
      this.loggedUser = user;
      this.updateHeader();

      if (user) {
        this.cartService.updateCartCounter().subscribe();
      }
    });

    this.loginService.getLoggedUser().subscribe(() => this.updateHeader());
  }

  updateHeader() {
    const accountContainer = document.querySelector('.account-container') as HTMLElement;
    const userMenuContainer = document.querySelector('.user-menu-container') as HTMLElement;

    if (this.loggedUser) {
      accountContainer.style.display = 'none';
      userMenuContainer.style.display = 'flex';

      const btnName = document.querySelector('.username-btn') as HTMLElement;
      if (btnName) btnName.textContent = this.loggedUser.name;

      const ddName = document.querySelector('.username-dd') as HTMLElement;
      const ddEmail = document.querySelector('.email-dd') as HTMLElement;

      if (ddName) ddName.textContent = this.loggedUser.name;
      if (ddEmail) ddEmail.textContent = this.loggedUser.email;
    } else {
      accountContainer.style.display = 'flex';
      userMenuContainer.style.display = 'none';
    }
  }

  logout() {
    this.loginService.logout().subscribe();
    this.cartCounter = '0';
    this.router.navigate(['/']);
  }
}
