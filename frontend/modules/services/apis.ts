import axios from 'axios';

export type Product = {
  sku: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  quantity: number;
};

export type Cart = {
  itemId: string;
  quantity: number;
  price: number;
  name: string;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>(
    'http://localhost:8082/api/v1/products'
  );
  return res.data;
};

export const addProductToCart = async (payload: Cart): Promise<any> => {
  const res = await axios.post<Cart>(
    'http://localhost:8082/api/v1/carts/items',
    {
      ...payload,
    }
  );
  return res.data;
};

export const getCart = async (): Promise<Cart[]> => {
  const res = await axios.get<Cart[]>('http://localhost:8082/api/v1/carts');
  return res.data;
};

export const deleteItem = async (itemId: string): Promise<any> => {
  const res = await axios.delete(
    `http://localhost:8082/api/v1/carts/items/${itemId}`
  );
  return res.data;
};
