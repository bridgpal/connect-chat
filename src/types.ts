export interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
}

export interface ProductResponse {
  products: Product[];
  totalResults: number;
}

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  products?: Product[];
}