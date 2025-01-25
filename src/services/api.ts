import type { Product } from '../types/Product';
import type { CartItem } from '../types/CartItem';

const BASE_URL = 'http://localhost:4321/api';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
}

export async function updateProduct( product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
}

export async function deleteProduct(product: Partial<Product>): Promise<void> {
  const response = await fetch(`${BASE_URL}/products`, { method: 'DELETE',    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to delete product');
}

export async function fetchCartItems(): Promise<CartItem[]> {
  const response = await fetch(`${BASE_URL}/cart`);
  if (!response.ok) throw new Error('Failed to fetch cart items');
  return response.json();
}

export async function addItemToCart(item: Omit<CartItem, 'id'>): Promise<CartItem> {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Failed to add item to cart');
  return response.json();
}

export async function updateCartItem(cart: Omit<CartItem, 'id'>): Promise<CartItem> {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cart),
  });
  if (!response.ok) throw new Error('Failed to update cart item');
  return response.json();
}

export async function removeCartItem(product:any): Promise<void> {
  const response = await fetch(`${BASE_URL}/cart`, { method: 'DELETE' , body: JSON.stringify(product),
});
  if (!response.ok) throw new Error('Failed to remove cart item');
}


export async function fetchDiscounts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/cart/discount`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}
