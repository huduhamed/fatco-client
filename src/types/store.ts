export type Category =
	| 'Club Jerseys'
	| 'National Team Jerseys'
	| 'Retro Jerseys'
	| 'Training Wear'
	| 'Accessories';

// product
export interface Product extends Record<string, unknown> {
	id: string;
	name: string;
	slug: string;
	description: string;
	team: string;
	category: Category;
	season: string;
	price: number;
	currency: string;
	image_url: string;
	additional_images: string[];
	sizes: string[];
	stock_quantity: number;
	is_available: boolean;
	is_featured: boolean;
	created_at: string;
	updated_at: string;
}

// cart item
export interface CartItem {
	product: Product;
	size: string;
	quantity: number;
}

export interface OrderInput {
	customer_name: string;
	phone: string;
	email: string;
	delivery_address: string;
	city: string;
	notes?: string;
	delivery_method: 'accra' | 'ghana' | 'pickup';
	items: Array<{ product_id: string; size: string; quantity: number }>;
}

// order item
export interface OrderItem {
	id?: string;
	product_id: string;
	product_name: string;
	size: string;
	quantity: number;
	unit_price: number;
	subtotal: number;
}

// order
export interface Order extends Omit<OrderInput, 'items'> {
	id: string;
	order_number: string;
	total_amount: number;
	currency: string;
	status: string;
	created_at: string;
	items: OrderItem[];
}
