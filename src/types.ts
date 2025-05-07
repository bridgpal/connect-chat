export interface Product {
  id: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parent?: string;
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
  categories?: {
    categories: Category[];
  };
}

export enum ToastType {
  Success = "success",
  Error = "error",
  Info = "info",
}
