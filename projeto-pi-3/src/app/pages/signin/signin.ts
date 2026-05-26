import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { User } from '../../core/types/types';
import { UserRegister } from '../../core/services/userRegister/user-register';
import { CepService } from '../../services/cep';
import { CpfService } from '../../services/cpf';
import { CnpjService } from '../../services/cnpj';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  tipoPessoa: 'PF' | 'PJ' = 'PF';

  nameField = '';
  cpfField = '';
  cnpjField = '';
  emailField = '';
  passwordField = '';
  passwordConfirmationField = '';

  cepField = '';
  logradouroField = '';
  bairroField = '';
  numeroField = '';
  localidadeField = '';
  ufField = '';

  firstInputName = true;
  firstInputCPF = true;
  firstInputCNPJ = true;
  firstInputEmail = true;
  firstInputPassword = true;
  firstInputPasswordC = true;
  firstInputNumero = true;

  nameError = '';
  cpfError = '';
  cnpjError = '';
  emailError = '';
  passwordError = '';
  passwordErrorMessage = '';
  numeroError = '';
  cepError = '';

  formValido = false;

  private ultimoCnpjBuscado = '';

  constructor(
    private userRegister: UserRegister,
    private router: Router,
    private cepService: CepService,
    private cpfService: CpfService,
    private cnpjService: CnpjService,
  ) {}

  trocarTipoPessoa(tipo: 'PF' | 'PJ'): void {
    this.tipoPessoa = tipo;

    this.cpfField = '';
    this.cnpjField = '';
    this.nameField = '';

    this.firstInputCPF = true;
    this.firstInputCNPJ = true;
    this.firstInputName = true;

    this.cpfError = '';
    this.cnpjError = '';
    this.nameError = '';
    this.ultimoCnpjBuscado = '';

    this.atualizarFormulario();
  }

  onlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Enter',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  validateNameInput(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Enter',
      'Home',
      'End',
      ' ',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^[A-Za-zÀ-ÿ]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  UpdateFirstInput(field: string): void {
    switch (field) {
      case 'name':
        this.firstInputName = false;
        break;

      case 'cpf':
        this.firstInputCPF = false;
        break;

      case 'cnpj':
        this.firstInputCNPJ = false;
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

      case 'numero':
        this.firstInputNumero = false;
        break;
    }

    this.atualizarFormulario();
  }

  onNameInput(): void {
    this.firstInputName = false;
    this.NameIsValid(this.nameField);
    this.atualizarFormulario();
  }

  onCPFInput(): void {
    this.firstInputCPF = false;

    let value = this.cpfField.replace(/\D/g, '').slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.cpfField = value;

    this.CPFIsValid(this.cpfField);
    this.atualizarFormulario();
  }

  onCNPJInput(): void {
    this.firstInputCNPJ = false;

    let value = this.cnpjField.replace(/\D/g, '').slice(0, 14);

    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');

    this.cnpjField = value;

    const cnpjValido = this.CNPJIsValid(this.cnpjField);

    if (cnpjValido) {
      this.buscarRazaoSocial();
    }

    this.atualizarFormulario();
  }

  onCEPInput(): void {
    let value = this.cepField.replace(/\D/g, '').slice(0, 8);

    this.cepField = value;
    this.cepError = '';

    this.atualizarFormulario();
  }

  onNumeroInput(): void {
    this.firstInputNumero = false;

    let value = this.numeroField.replace(/\D/g, '').slice(0, 10);

    this.numeroField = value;

    if (!value) {
      this.numeroError = 'Número obrigatório.';
    } else {
      this.numeroError = '';
    }

    this.atualizarFormulario();
  }

  buscarCEP(): void {
    const cep = this.cepField.replace(/\D/g, '');

    if (!cep) {
      this.cepError = 'CEP obrigatório.';
      this.atualizarFormulario();
      return;
    }

    if (cep.length !== 8) {
      this.cepError = 'CEP deve conter 8 números.';
      this.atualizarFormulario();
      return;
    }

    this.cepError = '';

    this.cepService.buscar(cep).subscribe({
      next: (dados) => {
        if (!dados.erro) {
          this.logradouroField = dados.logradouro;
          this.bairroField = dados.bairro;
          this.localidadeField = dados.localidade;
          this.ufField = dados.uf;
        } else {
          this.cepError = 'CEP não encontrado.';
        }

        this.atualizarFormulario();
      },
      error: () => {
        this.cepError = 'Erro ao buscar CEP.';
        this.atualizarFormulario();
      },
    });
  }

  buscarRazaoSocial(): void {
    const cnpjLimpo = this.cnpjField.replace(/\D/g, '');

    if (cnpjLimpo.length !== 14) {
      return;
    }

    if (!this.cnpjService.validar(cnpjLimpo)) {
      return;
    }

    if (this.ultimoCnpjBuscado === cnpjLimpo) {
      return;
    }

    this.ultimoCnpjBuscado = cnpjLimpo;

    this.cnpjService.buscarCNPJ(cnpjLimpo).subscribe({
      next: (dados) => {
        if (dados?.razao_social) {
          this.nameField = dados.razao_social;
          this.firstInputName = false;
          this.NameIsValid(this.nameField);
          this.atualizarFormulario();
        }
      },
      error: () => {
        this.cnpjError = 'CNPJ válido, mas não foi possível buscar a Razão Social.';
        this.atualizarFormulario();
      },
    });
  }

  NameIsValid(name: string): boolean {
    if (this.firstInputName) {
      this.nameError = '';
      return false;
    }

    const nomeLimpo = name.trim().replace(/\s+/g, '');

    if (nomeLimpo.length < 3) {
      this.nameError =
        this.tipoPessoa === 'PF' ? 'Nome inválido — mínimo 3 letras.' : 'Razão Social inválida.';
      return false;
    }

    this.nameError = '';
    return true;
  }

  CPFIsValid(cpfRef: string): boolean {
    if (this.firstInputCPF) {
      this.cpfError = '';
      return false;
    }

    const cpfLimpo = cpfRef.replace(/\D/g, '');

    if (!cpfLimpo) {
      this.cpfError = 'CPF obrigatório.';
      return false;
    }

    if (!this.cpfService.validar(cpfLimpo)) {
      this.cpfError = 'CPF inválido.';
      return false;
    }

    this.cpfError = '';
    return true;
  }

  CNPJIsValid(cnpjRef: string): boolean {
    if (this.firstInputCNPJ) {
      this.cnpjError = '';
      return false;
    }

    const cnpjLimpo = cnpjRef.replace(/\D/g, '');

    if (!cnpjLimpo) {
      this.cnpjError = 'CNPJ obrigatório.';
      return false;
    }

    if (!this.cnpjService.validar(cnpjLimpo)) {
      this.cnpjError = 'CNPJ inválido.';
      return false;
    }

    this.cnpjError = '';
    return true;
  }

  EmailIsValid(email: string): boolean {
    if (this.firstInputEmail) {
      this.emailError = '';
      return false;
    }

    const rules = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email.trim()) {
      this.emailError = 'E-mail obrigatório.';
      return false;
    }

    if (!rules.test(email)) {
      this.emailError = 'E-mail inválido.';
      return false;
    }

    this.emailError = '';
    return true;
  }

  PasswordIsValid(password: string): boolean {
    this.firstInputPassword = false;

    const rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,12}$/;

    if (!password) {
      this.passwordError = 'Senha obrigatória.';
      this.atualizarFormulario();
      return false;
    }

    if (!rules.test(password)) {
      this.passwordError =
        'A senha deve ter entre 8 e 12 caracteres, com maiúscula, minúscula, número e símbolo.';
      this.atualizarFormulario();
      return false;
    }

    this.passwordError = '';
    this.PasswordsAreValid();
    this.atualizarFormulario();
    return true;
  }

  PasswordsAreValid(): boolean {
    this.firstInputPasswordC = false;

    if (!this.passwordConfirmationField) {
      this.passwordErrorMessage = 'Confirme sua senha.';
      this.atualizarFormulario();
      return false;
    }

    if (this.passwordField !== this.passwordConfirmationField) {
      this.passwordErrorMessage = 'As senhas não coincidem.';
      this.atualizarFormulario();
      return false;
    }

    this.passwordErrorMessage = '';
    this.atualizarFormulario();
    return true;
  }

  private documentoValido(): boolean {
    if (this.tipoPessoa === 'PF') {
      return this.cpfService.validar(this.cpfField.replace(/\D/g, ''));
    }

    return this.cnpjService.validar(this.cnpjField.replace(/\D/g, ''));
  }

  private nomeValido(): boolean {
    return this.nameField.trim().replace(/\s+/g, '').length >= 3;
  }

  private emailValido(): boolean {
    const rules = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return rules.test(this.emailField);
  }

  private senhaValida(): boolean {
    const rules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,12}$/;

    return rules.test(this.passwordField);
  }

  private confirmacaoValida(): boolean {
    return (
      this.passwordConfirmationField.length > 0 &&
      this.passwordField === this.passwordConfirmationField
    );
  }

  private numeroValido(): boolean {
    return this.numeroField.replace(/\D/g, '').length > 0;
  }

  private cepValido(): boolean {
    return this.cepField.replace(/\D/g, '').length === 8;
  }

  atualizarFormulario(): void {
    this.formValido =
      this.nomeValido() &&
      this.documentoValido() &&
      this.emailValido() &&
      this.senhaValida() &&
      this.confirmacaoValida() &&
      this.numeroValido() &&
      this.cepValido();
  }

  focusNext(event: Event): void {
    event.preventDefault();

    const focusableElements = Array.from(
      document.querySelectorAll('input, button, select, textarea'),
    ).filter(
      (el: any) => !el.disabled && el.tabIndex !== -1 && el.offsetParent !== null,
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

    if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
      focusableElements[currentIndex + 1].focus();
    }
  }

  TogglePasswordVisibility(id: string, forceHide = false): void {
    const container = document.getElementById(`togglePasswordContainer${id}`);
    if (!container) return;

    const input = container.querySelector('input') as HTMLInputElement;
    const showIcon = document.getElementById(`show-icon-${id}`);
    const hideIcon = document.getElementById(`hide-icon-${id}`);

    if (!input || !showIcon || !hideIcon) return;

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

  TryRegisterUser(): void {
    this.firstInputName = false;
    this.firstInputEmail = false;
    this.firstInputPassword = false;
    this.firstInputPasswordC = false;
    this.firstInputNumero = false;

    if (this.tipoPessoa === 'PF') {
      this.firstInputCPF = false;
      this.CPFIsValid(this.cpfField);
    } else {
      this.firstInputCNPJ = false;
      this.CNPJIsValid(this.cnpjField);
    }

    this.NameIsValid(this.nameField);
    this.EmailIsValid(this.emailField);
    this.PasswordIsValid(this.passwordField);
    this.PasswordsAreValid();
    this.onNumeroInput();
    this.atualizarFormulario();

    if (!this.formValido) {
      return;
    }

    const rawCPF = this.cpfField.replace(/\D/g, '');
    const rawCNPJ = this.cnpjField.replace(/\D/g, '');
    const documento = this.tipoPessoa === 'PF' ? rawCPF : rawCNPJ;

    this.userRegister.isEmailRegistered(this.emailField).subscribe((emailExists) => {
      if (emailExists) {
        this.emailError = 'E-mail já cadastrado.';
        return;
      }

      this.userRegister.isCpfRegistered(documento).subscribe((documentExists) => {
        if (documentExists) {
          if (this.tipoPessoa === 'PF') {
            this.cpfError = 'CPF já cadastrado.';
          } else {
            this.cnpjError = 'CNPJ já cadastrado.';
          }

          return;
        }

        const newUser: User = {
          name: this.nameField,
          email: this.emailField,
          password: this.passwordField,
          cpf: documento,
        };

        this.userRegister.registerUser(newUser).subscribe({
          next: () => {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
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
