export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  products?: Product[];
}