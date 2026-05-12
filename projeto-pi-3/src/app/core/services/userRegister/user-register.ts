import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, of, catchError, throwError } from 'rxjs';
import { User } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class UserRegister {
  private API = `http://localhost:3000/users`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na API:', error.message);
    return throwError(() => new Error('Falha na operação. Tente novamente.'));
  }

  public isEmailRegistered(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.API}?email=${email}`).pipe(
      map((users) => users.length > 0),
      catchError(() => {
        console.warn('Falha ao checar e-mail (API pode estar offline)');
        return of(false);
      })
    );
  }

  public isCpfRegistered(cpf: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.API}?cpf=${cpf}`).pipe(
      map((users) => users.length > 0),
      catchError(() => {
        console.warn('Falha ao checar CPF (API pode estar offline)');
        return of(false);
      })
    );
  }

  public registerUser(userData: User): Observable<User> {
    return this.http.post<User>(this.API, userData).pipe(catchError(this.handleError));
  }
}
