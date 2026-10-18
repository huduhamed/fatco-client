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
	const responseText = await response.text();
	let body: { data?: T; error?: string } = {};
	if (responseText) {
		try {
			body = JSON.parse(responseText) as typeof body;
		} catch {
			if (response.ok) throw new Error('The API returned an invalid response.');
		}
	} else if (response.ok && response.status !== 204) {
		throw new Error('The API returned an empty response.');
	}

	if (!response.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
	return (body.data ?? body) as T;
}

function asArray<T>(value: unknown): T[] {
	if (!Array.isArray(value)) throw new Error('The API returned an unexpected list response.');
	return value as T[];
}

async function requestArray<T>(path: string): Promise<T[]> {
	return asArray(await request<unknown>(path));
}

// product service
export const productService = {
	list: async () => requestArray<Product>('/products').catch(() => templateProducts),
	featured: async () =>
		requestArray<Product>('/products?featured=true').catch(() =>
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
	products: async (token: string) =>
		asArray<Product>(await adminRequest<unknown>('/products', token)),
	orders: async (token: string) => asArray<Order>(await adminRequest<unknown>('/orders', token)),

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
