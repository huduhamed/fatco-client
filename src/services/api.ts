// internal imports
import type { Order, OrderInput, Product } from '../types/store';
import { templateProducts } from '../config/templateProducts';

// api URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

// request
async function request<T>(path: string, options?: RequestInit): Promise<T> {
	const headers = new Headers(options?.headers);

	if (!(options?.body instanceof FormData) && !headers.has('Content-Type'))
		headers.set('Content-Type', 'application/json');

	const response = await fetch(`${API_URL}${path}`, { ...options, headers });
	const body = (await response.json().catch(() => ({}))) as { data?: T; error?: string };

	if (!response.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
	return (body.data ?? body) as T;
}

// product service
export const productService = {
	list: async () => request<Product[]>('/products').catch(() => templateProducts),
	featured: async () =>
		request<Product[]>('/products?featured=true').catch(() =>
			templateProducts.filter((product) => product.is_featured),
		),
	bySlug: async (slug: string) =>
		request<Product>(`/products/${encodeURIComponent(slug)}`).catch(() => {
			const product = templateProducts.find((item) => item.slug === slug);
			if (!product) throw new Error('Product not found.');
			return product;
		}),
};

// order service
export const orderService = {
	create: (order: OrderInput) =>
		request<Order>('/orders', { method: 'POST', body: JSON.stringify(order) }),
};

// admin request
export async function adminRequest<T>(path: string, token: string, options?: RequestInit) {
	return request<T>(`/admin${path}`, {
		...options,
		headers: { ...options?.headers, Authorization: `Bearer ${token}` },
	});
}

// admin service
export const adminService = {
	products: (token: string) => adminRequest<Product[]>('/products', token),
	orders: (token: string) => adminRequest<Order[]>('/orders', token),

	createProduct: (token: string, product: Record<string, unknown>) =>
		adminRequest<Product>('/products', token, { method: 'POST', body: JSON.stringify(product) }),

	updateProduct: (token: string, id: string, product: Record<string, unknown>) =>
		adminRequest<Product>(`/products/${id}`, token, {
			method: 'PUT',
			body: JSON.stringify(product),
		}),

	deleteProduct: (token: string, id: string) =>
		adminRequest<void>(`/products/${id}`, token, { method: 'DELETE' }),

	uploadImage: (token: string, file: File) => {
		const body = new FormData();
		body.append('image', file);
		return adminRequest<{ url: string }>('/uploads/images', token, { method: 'POST', body });
	},
};
