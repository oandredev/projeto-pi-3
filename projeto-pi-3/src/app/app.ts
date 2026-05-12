import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaskHeader } from './mask-header/mask-header';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { UserLoginService } from './core/services/userLogin/user-login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MaskHeader, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('projeto-angular-pizzaria');

  constructor(private loginService: UserLoginService) {}

  ngOnInit() {
    this.loginService.getLoggedUser().subscribe();
  }
}
