export interface Product {
  _id: string;
  title: string;
  price: number;
  description?: string;
  images?: string[];
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}