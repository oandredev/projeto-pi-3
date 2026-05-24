import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem, Offer, History } from '../../types/types';
import { BehaviorSubject, Observable, switchMap, map, throwError } from 'rxjs';
import { UserLoginService } from '../userLogin/user-login';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartAPI = 'http://localhost:3000/cart';
  private historyAPI = 'http://localhost:3000/history';

  private loggedUserId: string | null = null;
  cartCounter: BehaviorSubject<string> = new BehaviorSubject<string>('0');

  constructor(
    private http: HttpClient,
    private loginService: UserLoginService,
  ) {
    this.loginService._loggedUser.subscribe((user) => {
      this.loggedUserId = user?.id ?? null;
    });
  }

  addItem(offer: Offer): Observable<Cart> {
    if (!this.loggedUserId) {
      return throwError(() => new Error('Usuário não logado.'));
    }

    return this.userAlreadyBoughtGame(this.loggedUserId, offer.id).pipe(
      switchMap((alreadyBought) => {
        if (alreadyBought) {
          return throwError(() => new Error('Você já possui este jogo na sua biblioteca.'));
        }

        const newItem: CartItem = {
          id: crypto.randomUUID(),
          idUser: this.loggedUserId!,
          offer,
          quantity: '1',
          subtotal: String(this.getOfferPrice(offer).toFixed(2)),
        };

        return this.addItemForUser(this.loggedUserId!, newItem);
      }),
    );
  }

  private userAlreadyBoughtGame(idUser: string, offerId: string): Observable<boolean> {
    return this.http.get<History[]>(`${this.historyAPI}?idUser=${idUser}`).pipe(
      map((historyList) => {
        return historyList.some((history) =>
          history.cart?.items?.some((item) => item.offer?.id === offerId),
        );
      }),
    );
  }

  private addItemForUser(idUser: string, item: CartItem): Observable<Cart> {
    return this.getCartByUser(idUser).pipe(
      switchMap((cart) => {
        if (!cart) {
          return this.createCart(idUser).pipe(
            switchMap((newCart) => this.addOrUpdateItem(newCart, item)),
          );
        }

        return this.addOrUpdateItem(cart, item);
      }),
    );
  }

  private addOrUpdateItem(cart: Cart, item: CartItem): Observable<Cart> {
    const items = [...(cart.items ?? [])];

    const alreadyInCart = items.some((i) => i.offer.id === item.offer.id);

    if (alreadyInCart) {
      return throwError(() => new Error('Este jogo já está no carrinho.'));
    }

    item.quantity = '1';
    item.subtotal = String(this.calculateItemSubtotal(item).toFixed(2));

    items.push(item);

    const updated: Cart = {
      ...cart,
      items,
      valueTotal: String(this.calculateTotal(items).toFixed(2)),
    };

    return this.http
      .put<Cart>(`${this.cartAPI}/${cart.id}`, updated)
      .pipe(switchMap((res) => this.updateCartCounter().pipe(map(() => res))));
  }

  private createCart(idUser: string): Observable<Cart> {
    const payload: Omit<Cart, 'id'> = {
      idUser,
      items: [],
      valueTotal: '0.00',
      address: '',
      paymentMethod: '',
      date: '',
    };

    return this.http
      .post<Cart>(this.cartAPI, payload)
      .pipe(switchMap((res) => this.updateCartCounter().pipe(map(() => res))));
  }

  clearCart(): Observable<Cart> {
    if (!this.loggedUserId) {
      return throwError(() => new Error('Usuário não logado.'));
    }

    return this.getCartByUser(this.loggedUserId).pipe(
      switchMap((cart) => {
        if (!cart) {
          return throwError(() => new Error('Carrinho não encontrado.'));
        }

        const updated: Cart = {
          ...cart,
          items: [],
          valueTotal: '0.00',
        };

        return this.http
          .put<Cart>(`${this.cartAPI}/${cart.id}`, updated)
          .pipe(switchMap((res) => this.updateCartCounter().pipe(map(() => res))));
      }),
    );
  }

  private getCartByUser(idUser: string): Observable<Cart | null> {
    return this.http
      .get<Cart[]>(this.cartAPI)
      .pipe(map((carts) => carts.find((c) => c.idUser === idUser) || null));
  }

  getCartOfLoggedUser(): Observable<Cart | null> {
    if (!this.loggedUserId) {
      return throwError(() => new Error('Usuário não logado.'));
    }

    this.updateCartCounter().subscribe();

    return this.getCartByUser(this.loggedUserId);
  }

  private getOfferPrice(offer: any): number {
    const value = offer?.priceBase ?? offer?.price ?? 0;

    if (typeof value === 'number') {
      return value;
    }

    let str = String(value).trim();
    str = str.replace('R$', '').replace(/\s/g, '').replace(',', '.');

    const n = Number(str);

    return isNaN(n) ? 0 : n;
  }

  private calculateItemSubtotal(item: CartItem): number {
    return this.getOfferPrice(item.offer) * Number(item.quantity || 1);
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + this.calculateItemSubtotal(item), 0);
  }

  updateCartItem(item: CartItem): Observable<Cart> {
    if (!this.loggedUserId) {
      return throwError(() => new Error('Usuário não logado.'));
    }

    return this.getCartByUser(this.loggedUserId).pipe(
      switchMap((cart) => {
        if (!cart) {
          return throwError(() => new Error('Carrinho não encontrado.'));
        }

        const items = [...(cart.items ?? [])];
        const index = items.findIndex((i) => i.id === item.id);

        if (index === -1) {
          return throwError(() => new Error('Item não encontrado no carrinho.'));
        }

        items[index].quantity = '1';
        items[index].subtotal = String(this.calculateItemSubtotal(items[index]).toFixed(2));

        const updated: Cart = {
          ...cart,
          items,
          valueTotal: String(this.calculateTotal(items).toFixed(2)),
        };

        return this.http
          .put<Cart>(`${this.cartAPI}/${cart.id}`, updated)
          .pipe(switchMap((res) => this.updateCartCounter().pipe(map(() => res))));
      }),
    );
  }

  removeCartItem(itemId: string): Observable<Cart> {
    if (!this.loggedUserId) {
      return throwError(() => new Error('Usuário não logado.'));
    }

    return this.getCartByUser(this.loggedUserId).pipe(
      switchMap((cart) => {
        if (!cart) {
          return throwError(() => new Error('Carrinho não encontrado.'));
        }

        const items = (cart.items ?? []).filter((i) => String(i.id) !== String(itemId));

        const updated: Cart = {
          ...cart,
          items,
          valueTotal: String(this.calculateTotal(items).toFixed(2)),
        };

        return this.http
          .put<Cart>(`${this.cartAPI}/${cart.id}`, updated)
          .pipe(switchMap((res) => this.updateCartCounter().pipe(map(() => res))));
      }),
    );
  }

  updateCartCounter(): Observable<number> {
    if (!this.loggedUserId) {
      return throwError(() => new Error('Usuário não logado.'));
    }

    return this.getCartByUser(this.loggedUserId).pipe(
      map((cart) => {
        const count =
          !cart || !cart.items
            ? 0
            : cart.items.reduce((acc, item) => acc + Number(item.quantity), 0);

        this.cartCounter.next(String(count));
        return count;
      }),
    );
  }
}
