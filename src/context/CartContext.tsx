import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

// internal imports
import type { CartItem, Product } from '../types/store';

interface CartValue {
	items: CartItem[];
	count: number;
	subtotal: number;
	add: (p: Product, s: string, q?: number) => void;
	remove: (id: string, size: string) => void;
	update: (id: string, size: string, q: number) => void;
	clear: () => void;
}
const CartContext = createContext<CartValue | null>(null);
const key = 'fatco-cart-v1';

// cart provider
export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>(() => {
		try {
			return JSON.parse(localStorage.getItem(key) || '[]') as CartItem[];
		} catch {
			return [];
		}
	});
	useEffect(() => localStorage.setItem(key, JSON.stringify(items)), [items]);

	const value = useMemo<CartValue>(
		() => ({
			items,
			count: items.reduce((n, i) => n + i.quantity, 0),
			subtotal: items.reduce((n, i) => n + i.product.price * i.quantity, 0),
			add: (product, size, quantity = 1) =>
				setItems((old) => {
					const found = old.find((i) => i.product.id === product.id && i.size === size);
					return found
						? old.map((i) =>
								i === found
									? { ...i, quantity: Math.min(i.quantity + quantity, product.stock_quantity) }
									: i,
							)
						: [...old, { product, size, quantity }];
				}),
			remove: (id, size) =>
				setItems((old) => old.filter((i) => !(i.product.id === id && i.size === size))),
			update: (id, size, quantity) =>
				setItems((old) =>
					old.map((i) =>
						i.product.id === id && i.size === size
							? { ...i, quantity: Math.max(1, Math.min(quantity, i.product.stock_quantity)) }
							: i,
					),
				),
			clear: () => setItems([]),
		}),
		[items],
	);
	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
	const value = useContext(CartContext);
	if (!value) throw new Error('useCart must be inside CartProvider');
	return value;
}
