import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem, Offer } from '../../types/types';
import { BehaviorSubject, Observable, switchMap, map, throwError } from 'rxjs';
import { UserLoginService } from '../userLogin/user-login';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  /* APIs */
  private cartAPI = 'http://localhost:3000/cart';

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

  /* ==================================================== */

  addItem(offer: Offer): Observable<Cart> {
    if (!this.loggedUserId) {
      return throwError(() => new Error('Usuário não logado.'));
    }

    const newItem: CartItem = {
      id: crypto.randomUUID(), // <-- SEMPRE TEM ID
      idUser: this.loggedUserId,
      offer: offer,
      quantity: '1',
      subtotal: '0.00',
    };

    return this.addItemForUser(this.loggedUserId, newItem);
  }

  /* ==================================================== */

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

  /* ==================================================== */

  private addOrUpdateItem(cart: Cart, item: CartItem): Observable<Cart> {
    const items = [...(cart.items ?? [])];

    const index = items.findIndex((i) => i.offer.id === item.offer.id);

    if (index !== -1) {
      const currentQty = Number(items[index].quantity);
      const addedQty = Number(item.quantity);

      items[index].quantity = String(currentQty + addedQty);
      items[index].subtotal = String(this.calculateItemSubtotal(items[index]).toFixed(2));
    } else {
      item.subtotal = String(this.calculateItemSubtotal(item).toFixed(2));
      items.push(item);
    }

    const updated: Cart = {
      ...cart,
      items,
      valueTotal: String(this.calculateTotal(items).toFixed(2)),
    };

    return this.http
      .put<Cart>(`${this.cartAPI}/${cart.id}`, updated)
      .pipe(switchMap((res) => this.updateCartCounter().pipe(map(() => res))));
  }

  /* ==================================================== */

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

  /* ==================================================== */

  clearCart(): Observable<Cart> {
    if (!this.loggedUserId) return throwError(() => new Error('Usuário não logado.'));

    return this.getCartByUser(this.loggedUserId).pipe(
      switchMap((cart) => {
        if (!cart) return throwError(() => new Error('Carrinho não encontrado.'));

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

  /* ==================================================== */

  private getCartByUser(idUser: string): Observable<Cart | null> {
    return this.http
      .get<Cart[]>(this.cartAPI)
      .pipe(map((carts) => carts.find((c) => c.idUser === idUser) || null));
  }

  getCartOfLoggedUser() {
    if (!this.loggedUserId) return throwError(() => new Error('Usuário não logado.'));

    this.updateCartCounter().subscribe();

    return this.getCartByUser(this.loggedUserId);
  }

  /* ==================================================== */

  private parsePrice(value: any): number {
    if (value === null || value === undefined) return 0;

    let str = String(value).trim();
    str = str.replace('R$', '').replace(/\s/g, '');
    str = str.replace(',', '.');

    const n = Number(str);
    return isNaN(n) ? 0 : n;
  }

  private calculateItemSubtotal(item: CartItem): number {
    const offer = item.offer;
    if (!offer) return 0;

    const base = this.parsePrice(offer.priceBase);
    const quantity = Number(item.quantity);

    return base * quantity;
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + this.calculateItemSubtotal(item), 0);
  }

  /* ==================================================== */

  updateCartItem(item: CartItem): Observable<Cart> {
    if (!this.loggedUserId) return throwError(() => new Error('Usuário não logado.'));

    return this.getCartByUser(this.loggedUserId).pipe(
      switchMap((cart) => {
        if (!cart) return throwError(() => new Error('Carrinho não encontrado.'));

        const items = [...(cart.items ?? [])];
        const index = items.findIndex((i) => i.id === item.id);
        if (index === -1) return throwError(() => new Error('Item não encontrado no carrinho.'));

        items[index].quantity = String(item.quantity);
        items[index].subtotal = String(this.calculateItemSubtotal(item).toFixed(2));

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

  /* ==================================================== */

  removeCartItem(itemId: string): Observable<Cart> {
    if (!this.loggedUserId) {
      return throwError(() => new Error('Usuário não logado.'));
    }

    return this.getCartByUser(this.loggedUserId).pipe(
      switchMap((cart) => {
        if (!cart) {
          return throwError(() => new Error('Carrinho não encontrado.'));
        }

        const targetId = String(itemId);
        const items = (cart.items ?? []).filter((i) => String(i.id) !== targetId);

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

  /* ==================================================== */

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
