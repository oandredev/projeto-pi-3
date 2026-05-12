export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  cpf: string; // Only numbers
}

/*-----------------------------------------------------------------------------------*/

export interface Offer {
  // Game
  id: string;
  name: string;
  priceBase: string;
  description: string;
  developer: string;
  publisher: string;
  images: string[]; // URLs
}

/*-----------------------------------------------------------------------------------*/

export interface CartItem {
  id: string;
  idUser: string;
  offer: Offer;
  quantity: string;
  subtotal: string;
}

export interface Cart {
  id?: string;
  idUser: string;
  items?: CartItem[];
  valueTotal?: string;
  address?: string;
  date?: string;
  paymentMethod?: 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto' | 'Pix' | '';
}

/*-----------------------------------------------------------------------------------*/

export interface History {
  id?: string;
  idUser: string;
  cart: Cart;
  status: 'Aguardando pagamento' | 'Finalizado' | 'Cancelado';
}
