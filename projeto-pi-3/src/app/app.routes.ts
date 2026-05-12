import { Routes } from '@angular/router';
import { Signin } from './pages/signin/signin';
import { Login } from './pages/login/login';
import { Offers } from './pages/offers/offers';
import { OfferDetails } from './pages/offer-details/offer-details';
import { History } from './pages/history/history';
import { AboutUs } from './pages/about-us/about-us';
import { CartView } from './pages/cart/cart';
import { PaymentQRCode } from './pages/payment-qrcode/payment-qrcode';
import { PurchaseConfirmation } from './pages/purchase-confirmation/purchase-confirmation';

export const routes: Routes = [
  { path: '', component: Offers, title: 'Ofertas' }, // Página inicial
  { path: 'login', component: Login, title: 'Login' },
  { path: 'signin', component: Signin, title: 'Cadastrar' },
  { path: 'offers', component: Offers, title: 'Ofertas' },
  { path: 'offer-details/:id', component: OfferDetails, title: 'Detalhes da Oferta' },
  { path: 'history', component: History, title: 'Histórico' },
  { path: 'about-us', component: AboutUs, title: 'Sobre Nós' },
  { path: 'cart', component: CartView, title: 'Carrinho' },
  {
    path: 'purchaseConfirmation',
    component: PurchaseConfirmation,
    title: 'Compra Realizada com Sucesso',
  },
  { path: 'paymentQRCode', component: PaymentQRCode, title: 'Pagamento | QR Code' },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // 404
];
