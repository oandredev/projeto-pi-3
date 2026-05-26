import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../../core/services/userLogin/user-login';
import { User } from '../../core/types/types';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { take } from 'rxjs/internal/operators/take'; // Evita o memory leak

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [RouterModule, FormsModule],
})
export class Login implements OnInit {
  emailField = '';
  passwordField = '';
  passwordVisible = false;
  errorMessage = '';

  constructor(
    private loginService: UserLoginService,
    private router: Router,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loginService
        .isLogged()
        .pipe(take(1))
        .subscribe((isLogged) => {
          if (isLogged) {
            alert('Você já está logado! Redirecionando para as ofertas...');
            this.router.navigate(['/offers']);
          }
        });
    });
  }

  TogglePasswordVisibility(forceHide: boolean = false) {
    this.passwordVisible = forceHide ? false : !this.passwordVisible;
  }

  ValidateLogin() {
    const errorMessage = document.querySelector('#errorLoginOrPassword') as HTMLElement;

    this.loginService.tryLogin(this.emailField, this.passwordField).subscribe({
      next: (user: User | null) => {
        if (user) {
          errorMessage.textContent = '';
          this.loginService.setUser(user).subscribe();
          this.errorMessage = '';
          this.router.navigate(['/offers']);
        } else {
          errorMessage.textContent = 'Email ou senha inválidos';
        }
      },
      error: () => {
        errorMessage.textContent = 'Erro ao fazer login';
      },
    });
  }
}
