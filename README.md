# 🎮 A&F Games — Projeto Integrador 3

Plataforma de e-commerce de jogos digitais desenvolvida como projeto acadêmico para a disciplina de Projeto Integrador 3, sob orientação do **Prof. Marco de Arruda**.

---

## 📋 Sobre o Projeto

**A&F Games** é uma loja virtual de jogos digitais que permite aos usuários navegar por um catálogo de ofertas, adicionar jogos ao carrinho, realizar compras e acompanhar o histórico de pedidos. O projeto simula um ambiente real de e-commerce com autenticação de usuário, gerenciamento de carrinho e biblioteca pessoal de jogos adquiridos.

---

## ✨ Funcionalidades

- 🔐 Autenticação de usuário (login e logout)
- 🛒 Carrinho de compras com múltiplos métodos de pagamento como: débito, crédito e PIX (Exclusivo do Brasil)
- 🎮 Catálogo de jogos com detalhes individuais por título
- 📦 Histórico de pedidos com status de compra
- 📚 Biblioteca pessoal com jogos adquiridos
- 👥 Página da equipe de desenvolvimento

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia  | Versão         |
| ----------- | -------------- |
| Angular     | `20.3.8`       |
| JSON Server | `1.0.0-beta-3` |

---

## 📁 Estrutura do Projeto

```markdown
src/
├── app/
│ ├── core/
│ │ ├── services/
│ │ │ ├── cart/
│ │ │ ├── history/
│ │ │ ├── offers/
│ │ │ ├── userLogin/
│ │ │ └── userRegister/
│ │ └── types/
│ │
│ ├── footer/
│ ├── header/
│ ├── mask-header/
│ │
│ ├── pages/
│ │ ├── about-us/
│ │ ├── cart/
│ │ ├── developers/
│ │ ├── history/
│ │ ├── library/
│ │ ├── login/
│ │ ├── offer-details/
│ │ ├── offers/
│ │ ├── payment-qrcode/
│ │ ├── purchase-confirmation/
│ │ └── signin/
│ │
│ ├── services/
│ │
│ ├── app.config.ts
│ ├── app.css
│ ├── app.html
│ ├── app.routes.ts
│ ├── app.spec.ts
│ └── app.ts
│
├── index.html
├── main.ts
└── styles.css
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Angular CLI instalado globalmente
- Json-Server instalado globalmente

```bash
npm install -g @angular/cli@20.3.8
```

```bash
npm install -g json-server@1.0.0-beta.3
```

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/oandredev/projeto-pi-3
```

1.1 Após clonar, abra o projeto na IDE e abra a pasta root (OBS: São duas com o mesmo nome `projeto-pi-3`):

```bash
cd projeto-pi-3
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o JSON Server (banco de dados simulado):

```bash
npx json-server --watch db.json --port 3000
```

4. Em outro terminal, inicie o Angular:

```bash
ng serve
```

5. Acesse no navegador e teste:

http://localhost:4200

5.1

Utilize o seguinte site para gerar `CPF` e `CNPJ` para os testes:

https://www.4devs.com.br/gerador_de_cpf

https://www.4devs.com.br/gerador_de_cnpj

---

## 👨‍💻 Equipe

| Nome            | GitHub                                               |
| --------------- | ---------------------------------------------------- |
| André Rodrigues | [@oandredev](https://github.com/oandredev)           |
| Fernanda Souza  | [@souzafe13](https://github.com/souzafe13)           |
| André Coutinho  | [@AndreCoutinhom](https://github.com/AndreCoutinhom) |

---

## 🎓 Informações Acadêmicas

- **Disciplina:** Projeto Integrador 3
- **Orientador:** Prof. Marco de Arruda
- **Instituição:** `Centro Universitário SENAC - Santo Amaro`
- **Curso:** `Análise e Desenvolvimento de Sistemas`

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
