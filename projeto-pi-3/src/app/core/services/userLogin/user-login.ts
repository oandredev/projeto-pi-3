import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { User } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  /* APIs */
  private registerAPI = `http://localhost:3000/users`;
  private loginAPI = `http://localhost:3000/loggedUser`;

  public _loggedUser = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  tryLogin(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.registerAPI).pipe(
      map((users) => {
        return users.find((u) => u.email === email && (u as any).password === password) || null;
      })
    );
  }

  setUser(user: User | null): Observable<any> {
    const payload = { id: 1, user };

    return this.http.put(this.loginAPI, payload).pipe(tap(() => this._loggedUser.next(user)));
  }

  logout(): Observable<any> {
    const payload = { id: 1, user: null };

    return this.http.put(this.loginAPI, payload).pipe(tap(() => this._loggedUser.next(null)));
  }

  isLogged(): Observable<boolean> {
    return this._loggedUser.asObservable().pipe(map((user) => user !== null));
  }

  getLoggedUser(): Observable<User | null> {
    return this.http.get<{ id: number; user?: User | null }>(this.loginAPI).pipe(
      map((data) => data.user ?? null),
      tap((user) => this._loggedUser.next(user))
    );
  }
}
