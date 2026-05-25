export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  cpf: string; // Only numbers
}

/*-----------------------------------------------------------------------------------*/

export interface Offer {
  id: string;
  name: string;
  priceBase: number;
  imageUrl: string;
  description?: string;
  developer?: string;
  publisher?: string;
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
  paymentMethod?: 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | '';
}

/*-----------------------------------------------------------------------------------*/

export interface History {
  id?: string;
  idUser: string;
  cart: Cart;
  status: 'Aguardando pagamento' | 'Finalizado' | 'Cancelado';
}
