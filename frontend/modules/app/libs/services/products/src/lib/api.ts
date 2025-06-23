import { Product } from './types';

// Simple products API for testing
export async function getProducts(): Promise<Product[] | null> {
  try {
    const response = await fetch('http://localhost:8082/api/v1/products');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error('Failed to fetch products');
  }
}

// Export a default function for backward compatibility
export default getProducts;
