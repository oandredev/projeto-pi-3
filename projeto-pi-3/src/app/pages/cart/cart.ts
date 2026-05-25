import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart/cart-service';
import { HistoryService } from '../../core/services/history/history-service';
import { UserLoginService } from '../../core/services/userLogin/user-login';
import { Cart, CartItem, History } from '../../core/types/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  imports: [CommonModule, FormsModule],
})
export class CartView {
  /*Vars */
  private loggedUserId: string | null = null;
  cart: Cart | null = null;
  paymentMethod: string = '';
  selectedCard: string = '';
  installments: number = 1;
  cards = ['1x sem juros', '2x sem juros', '3x sem juros'];

  constructor(
    private cartService: CartService,
    private historyService: HistoryService,
    private loginService: UserLoginService,
    private router: Router,
  ) {
    this.loginService._loggedUser.subscribe((user) => {
      this.loggedUserId = user?.id ?? null;

      // Depends of logged user
      if (this.loggedUserId) {
        this.loadCart();
      }
    });
  }

  loadCart() {
    this.cartService.getCartOfLoggedUser().subscribe((cart) => {
      this.cart = cart;
    });
  }

  removeItem(item: CartItem) {
    if (!this.cart || !this.cart.items) return;

    const confirmDelete = confirm(
      `Deseja realmente excluir o jogo "${item.offer.name}" do carrinho?`,
    );

    if (!confirmDelete) {
      return;
    }

    this.cart.items = this.cart.items.filter((i) => i !== item);
    this.cartService.removeCartItem(item.id!).subscribe();
  }

  getSubtotal(item: CartItem): number {
    return Number(item.subtotal);
  }

  /* Validação */
  isOrderValid(): boolean {
    const isCartNotEmpty = this.cart && this.cart.items && this.cart.items.length > 0;
    const isPaymentSelected = !!this.paymentMethod;

    if (!isCartNotEmpty || !isPaymentSelected) {
      return false;
    }

    if (this.paymentMethod === 'credito') {
      return this.installments > 0;
    }

    return true;
  }

  finishOrder() {
    if (!this.isOrderValid()) {
      alert('Por favor, verifique se o carrinho não está vazio...');
      return;
    }

    if (this.cart) {
      this.cart.paymentMethod = (this.paymentMethod as Cart['paymentMethod']) || '';
      // ------------------------------------------------------------------

      const dateFormated = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date());

      this.cart.date = String(dateFormated);
    }

    const newHistory: History = {
      idUser: String(this.loggedUserId),
      cart: this.cart!,
      status: 'Finalizado',
    };

    this.historyService.saveHistory(newHistory).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe({
          next: (updatedCart) => {
            this.cart = updatedCart;
            if (this.paymentMethod === 'pix') {
              this.router.navigate(['/paymentQRCode']);
            } else {
              this.router.navigate(['/purchaseConfirmation']);
            }
          },
          error: (err) => console.error('Erro ao limpar carrinho:', err),
        });
      },
      error: (err) => console.error('Erro ao salvar histórico:', err),
    });
  }
}
