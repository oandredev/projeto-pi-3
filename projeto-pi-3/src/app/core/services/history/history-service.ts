import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { History } from '../../types/types';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserLoginService } from '../userLogin/user-login';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private historyAPI = 'http://localhost:3000/history';
  // Vars
  private loggedUserId: string | null = null;

  constructor(
    private http: HttpClient,
    private loginService: UserLoginService,
  ) {
    this.loginService._loggedUser.subscribe((user) => {
      this.loggedUserId = user?.id ?? null;
    });
  }

  /*==================================================== */

  saveHistory(newHistory: History): Observable<History> {
    return this.http.post<History>(this.historyAPI, newHistory).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro ao salvar histórico de compras:', error);
    return throwError(() => new Error('Erro ao salvar histórico. Tente novamente.'));
  }

  // Filtro usando o campo 'cart.idUser' para buscar no histórico
  // Exemplo de URL: http://localhost:3000/history?cart.idUser=eef8
  getHistoryByUser(): Observable<History[]> {
    const urlWithFilter = `${this.historyAPI}?cart.idUser=${this.loggedUserId}`;

    return this.http.get<History[]>(urlWithFilter).pipe(catchError(this.handleError));
  }
}
