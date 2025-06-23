export interface Product {
  sku: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  quantity?: number;
}
