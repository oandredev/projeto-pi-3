import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/types/types';
import { UserRegister } from '../../core/services/userRegister/user-register';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  alertName!: HTMLElement;
  alertCPF!: HTMLElement;
  alertEmail!: HTMLElement;
  alertPassword!: HTMLElement;
  alertPasswordC!: HTMLElement;

  firstInputName = true;
  firstInputCPF = true;
  firstInputEmail = true;
  firstInputPassword = true;
  firstInputPasswordC = true;

  buttonSubmit!: HTMLButtonElement;

  nameField = '';
  cpfField = '';
  emailField = '';
  passwordField = '';
  passwordConfirmationField = '';

  constructor(private userRegister: UserRegister, private router: Router) {}

  ngOnInit(): void {
    this.alertName = document.getElementById('errorName')!;
    this.alertCPF = document.getElementById('errorCPF')!;
    this.alertEmail = document.getElementById('errorEmail')!;
    this.alertPassword = document.getElementById('errorPassword')!;
    this.alertPasswordC = document.getElementById('errorPasswordC')!;
    this.buttonSubmit = document.getElementById('buttonSubmit') as HTMLButtonElement;
  }

  /* ===================================================== */

  onNameInput(): void {
    this.nameField = this.nameField.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    this.NameIsValid(this.nameField);
    this.checkForm();
  }

  onCPFInput(): void {
    this.cpfField = this.cpfField.replace(/\D/g, '');
    this.cpfField = this.formatCPF(this.cpfField);
    this.CPFIsValid(this.cpfField);
    this.checkForm();
  }

  onEmailInput(): void {
    this.EmailIsValid(this.emailField);
    this.checkForm();
  }

  onPasswordInput(): void {
    this.PasswordIsValid(this.passwordField);
    this.checkForm();
  }

  onPasswordConfirmationInput(): void {
    this.PasswordsAreValid();
    this.checkForm();
  }

  /* ===================================================== */

  UpdateFirstInput(field: string): void {
    switch (field) {
      case 'name':
        this.firstInputName = false;
        break;
      case 'cpf':
        this.firstInputCPF = false;
        break;
      case 'email':
        this.firstInputEmail = false;
        break;
      case 'password':
        this.firstInputPassword = false;
        break;
      case 'passwordC':
        this.firstInputPasswordC = false;
        break;
    }
  }

  /* ===================================================== */

  checkForm(): boolean {
    const valid =
      this.NameIsValid(this.nameField) &&
      this.CPFIsValid(this.cpfField) &&
      this.EmailIsValid(this.emailField) &&
      this.PasswordIsValid(this.passwordField) &&
      this.PasswordsAreValid();

    this.buttonSubmit.disabled = !valid;
    return valid == undefined ? false : valid;
  }

  /* Nome */

  NameIsValid(name: string): boolean | undefined {
    if (this.firstInputName) {
      this.alertName.style.display = 'none';
      return;
    }

    if (name.replace(/\s+/g, '').length < 3) {
      this.alertName.textContent = 'Nome inválido — mínimo 3 letras.';
      this.alertName.style.display = 'block';
      return false;
    }

    this.alertName.style.display = 'none';
    return true;
  }

  /* ===================================================== */
  /* CPF */

  formatCPF(raw: string): string {
    const nums = raw.replace(/\D/g, '').slice(0, 11);

    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return nums.replace(/(\d{3})(\d+)/, '$1.$2');
    if (nums.length <= 9) return nums.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');

    return nums.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
  }

  CPFIsValid(cpfRef: string): boolean | undefined {
    if (this.firstInputCPF) {
      this.alertCPF.style.display = 'none';
      return;
    }

    const cpf = cpfRef.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      this.alertCPF.textContent = 'CPF inválido.';
      this.alertCPF.style.display = 'block';
      return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== Number(cpf[9])) {
      this.alertCPF.textContent = 'CPF inválido.';
      this.alertCPF.style.display = 'block';
      return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== Number(cpf[10])) {
      this.alertCPF.textContent = 'CPF inválido.';
      this.alertCPF.style.display = 'block';
      return false;
    }

    this.alertCPF.style.display = 'none';
    return true;
  }

  /* ===================================================== */
  /* Email */

  EmailIsValid(email: string): boolean | undefined {
    if (this.firstInputEmail) {
      this.alertEmail.style.display = 'none';
      return;
    }

    const rules = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!rules.test(email)) {
      this.alertEmail.textContent = 'E-mail inválido.';
      this.alertEmail.style.display = 'block';
      return false;
    }

    this.alertEmail.style.display = 'none';
    return true;
  }

  /* ===================================================== */
  /* Senha */

  PasswordIsValid(password: string): boolean | undefined {
    if (this.firstInputPassword) {
      this.alertPassword.style.display = 'none';
      return;
    }

    const rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

    if (!rules.test(password)) {
      this.alertPassword.textContent =
        'Senha inválida — mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo.';
      this.alertPassword.style.display = 'block';
      return false;
    }

    this.alertPassword.style.display = 'none';

    this.PasswordsAreValid();

    return true;
  }

  /* ===================================================== */
  /* Confirmar senha */

  PasswordsAreValid(): boolean {
    const pass = this.passwordField;
    const confirm = this.passwordConfirmationField;

    const match = pass === confirm;

    if (!this.firstInputPasswordC) {
      this.alertPasswordC.style.display = match ? 'none' : 'block';
      if (!match) this.alertPasswordC.textContent = 'Senhas não coincidem.';
    } else {
      this.alertPasswordC.style.display = 'none';
    }

    return match;
  }

  /* ===================================================== */
  /* Toggle password visibility */

  TogglePasswordVisibility(id: string, forceHide = false): void {
    const container = document.getElementById(`togglePasswordContainer${id}`);
    if (!container) return;

    const input = container.querySelector('input') as HTMLInputElement;

    const showIcon = document.getElementById(`show-icon-${id}`)!;
    const hideIcon = document.getElementById(`hide-icon-${id}`)!;

    const showing = input.type === 'text';

    if (!showing && !forceHide) {
      input.type = 'text';
      showIcon.style.display = 'none';
      hideIcon.style.display = 'block';
    } else {
      input.type = 'password';
      showIcon.style.display = 'block';
      hideIcon.style.display = 'none';
    }
  }

  /* ===================================================== */

  TryRegisterUser(): void {
    const rawCPF = this.cpfField.replace(/\D/g, '');

    this.userRegister.isEmailRegistered(this.emailField).subscribe((emailExists) => {
      if (emailExists) {
        this.alertEmail.textContent = 'E-mail já cadastrado.';
        this.alertEmail.style.display = 'block';
      }

      this.userRegister.isCpfRegistered(rawCPF).subscribe((cpfExists) => {
        if (cpfExists) {
          this.alertCPF.textContent = 'CPF já cadastrado.';
          this.alertCPF.style.display = 'block';
        }

        if (emailExists || cpfExists) {
          return;
        }

        // Se chegou até aqui, pode registrar
        const newUser: User = {
          name: this.nameField,
          email: this.emailField,
          password: this.passwordField,
          cpf: rawCPF,
        };

        this.userRegister.registerUser(newUser).subscribe({
          next: () => {
            console.log('Usuário registrado. -> ' + newUser.name);
            this.router.navigate(['/login']);
          },
          error: () => {
            console.error('Falha ao registrar.');
          },
        });
      });
    });
  }
}
