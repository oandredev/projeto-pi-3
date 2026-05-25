import { Component } from '@angular/core';
import { HistoryService } from '../../core/services/history/history-service';
import { History as HistoryT, CartItem } from '../../core/types/types';
import { CommonModule } from '@angular/common';
import { UserLoginService } from '../../core/services/userLogin/user-login';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {
  private loggedUserId: string | null = null;
  historyList: HistoryT[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private historyService: HistoryService,
    private loginService: UserLoginService,
  ) {
    this.loginService._loggedUser.subscribe((user) => {
      this.loggedUserId = user?.id ?? null;

      // Depends of logged user
      if (this.loggedUserId) {
        this.exibirHistorico();
      }
    });
  }

  exibirHistorico(): void {
    this.isLoading = true;
    this.errorMessage = null;
    console.log('Carregando histórico de compras do usuário...');
    this.historyService.getHistoryByUser().subscribe({
      next: (data: HistoryT[]) => {
        this.historyList = data.slice().reverse();
        this.isLoading = false;
        console.log('Histórico de compras carregado:', this.historyList);
      },
      error: (error: any) => {
        this.errorMessage =
          'Não foi possível carregar o histórico de compras. Verifique a conexão com a API.';
        this.isLoading = false;
        console.error('Erro ao carregar histórico:', error);
      },
      complete: () => {
        console.log('Requisição de histórico finalizada.');
      },
    });
  }

  /**
   * Função auxiliar para garantir que uma string de valor seja convertida
   * em um número válido
   */
  private getSafeValue(value: string | undefined | null): number {
    if (value === null || value === undefined) {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Função para calcular o valor base + customizações de um item (para referência)
  calculateItemBaseValue(item: CartItem): number {
    // Usa a função auxiliar para garantir que o valor base é um número (usa optional chaining)
    const base = this.getSafeValue(String(item.offer?.priceBase ?? '0'));

    return base;
  }

  formatPaymentMethod(method?: string): string {
    switch (method?.toLowerCase()) {
      case 'pix':
        return 'PIX';
      case 'credito':
        return 'Cartão de Crédito';
      case 'debito':
        return 'Cartão de Débito';
      default:
        return method?.toUpperCase() ?? '';
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Aguardando pagamento': 'pendente',
      Finalizado: 'aprovado',
      Cancelado: 'cancelado',
    };
    return map[status] ?? 'pendente';
  }
}
