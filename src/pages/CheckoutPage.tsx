import { useMemo, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';

// internal imports
import { Seo } from '../components/products/Seo';
import { Button } from '../components/ui/Button';
import { shippingConfig } from '../config/business';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../lib/format';
import { orderService } from '../services/api';
import type { OrderInput } from '../types/store';

// schema
const schema = z.object({
	customer_name: z.string().min(2, 'Enter your name'),
	phone: z.string().min(7, 'Enter a valid phone number'),
	email: z.string().email('Enter a valid email'),
	delivery_address: z.string().min(5, 'Enter a delivery address'),
	city: z.string().min(2, 'Enter a city'),
	notes: z.string().max(500),
	delivery_method: z.enum(['accra', 'ghana', 'pickup']),
});
type Fields = z.infer<typeof schema>;

// checkout page
export function CheckoutPage() {
	const { items, subtotal, clear } = useCart();
	const navigate = useNavigate();
	const [fields, setFields] = useState<Fields>({
		customer_name: '',
		phone: '',
		email: '',
		delivery_address: '',
		city: 'Accra',
		notes: '',
		delivery_method: 'accra',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [serverError, setServerError] = useState('');
	const [busy, setBusy] = useState(false);
	const shipping = useMemo(
		() =>
			subtotal >= shippingConfig.freeShippingThreshold
				? 0
				: shippingConfig[fields.delivery_method].fee,
		[subtotal, fields.delivery_method],
	);
	if (!items.length) return <Navigate to="/cart" replace />;

	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (busy) return;

		const parsed = schema.safeParse(fields);
		if (!parsed.success) {
			const fieldErrors = Object.fromEntries(
				Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
					key,
					messages?.[0] || 'Invalid',
				]),
			);
			setErrors(fieldErrors);
			setServerError('Please correct the highlighted fields before placing your order.');

			const firstInvalidField = Object.keys(fieldErrors)[0];
			const input = e.currentTarget.elements.namedItem(firstInvalidField);
			if (input instanceof HTMLElement) {
				input.focus();
				input.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
			return;
		}
		setBusy(true);
		setErrors({});
		setServerError('');
		try {
			if (items.some((item) => !z.uuid().safeParse(item.product.id).success))
				throw new Error(
					'Your cart contains preview products because the store could not reach its catalogue. Please reload the shop once the server is available and add the items again.',
				);

			const payload: OrderInput = {
				...parsed.data,
				items: items.map((i) => ({ product_id: i.product.id, size: i.size, quantity: i.quantity })),
			};
			const order = await orderService.create(payload);
			clear();
			navigate('/order-success', { state: { order } });
		} catch (err) {
			setServerError(
				err instanceof TypeError
					? 'We could not reach the order server. Please check your connection and try again.'
					: (err as Error).message,
			);
		} finally {
			setBusy(false);
		}
	}
	function field(name: keyof Fields, value: string) {
		setFields((old) => ({ ...old, [name]: value }));
		setErrors((old) => {
			if (!old[name]) return old;
			const next = { ...old };
			delete next[name];
			return next;
		});
		setServerError('');
	}
	return (
		<div className="container page">
			<Seo title="Checkout | Fatco" description="Place your Fatco jersey order." />
			<header className="page-header compact">
				<p className="eyebrow">Almost there</p>
				<h1>Checkout</h1>
				<p>Submit your order. We’ll contact you to confirm delivery and manual payment.</p>
			</header>
			<form className="checkout-layout" onSubmit={submit}>
				<div className="form-card">
					<h2>Your details</h2>
					<div className="form-grid">
						{[
							['customer_name', 'Full name', 'text'],
							['phone', 'Phone number', 'tel'],
							['email', 'Email address', 'email'],
							['city', 'City', 'text'],
							['delivery_address', 'Delivery address', 'text'],
						].map(([name, label, type]) => (
							<label className={name === 'delivery_address' ? 'wide' : ''} key={name}>
								{label}
								<input
									name={name}
									type={type}
									value={String(fields[name as keyof Fields])}
									onChange={(e) => field(name as keyof Fields, e.target.value)}
									aria-invalid={Boolean(errors[name])}
									required
									minLength={name === 'customer_name' || name === 'city' ? 2 : name === 'phone' ? 7 : name === 'delivery_address' ? 5 : undefined}
									autoComplete={
										name === 'customer_name'
											? 'name'
											: name === 'delivery_address'
												? 'street-address'
												: name
									}
								/>
								{errors[name] && <small>{errors[name]}</small>}
							</label>
						))}
						<label className="wide">
							Delivery method
							<select
								name="delivery_method"
								value={fields.delivery_method}
								onChange={(e) => field('delivery_method', e.target.value)}
							>
								{Object.entries(shippingConfig)
									.filter(([k]) => k !== 'freeShippingThreshold')
									.map(([key, v]) => (
										<option value={key} key={key}>
											{typeof v === 'object' && 'label' in v ? v.label : key}
										</option>
									))}
							</select>
						</label>
						<label className="wide">
							Order notes (optional)
							<textarea
								name="notes"
								rows={4}
								maxLength={500}
								value={fields.notes}
								onChange={(e) => field('notes', e.target.value)}
							/>
						</label>
					</div>
				</div>
				<aside className="summary checkout-summary">
					<h2>Your order</h2>
					{items.map((i) => (
						<div key={`${i.product.id}-${i.size}`}>
							<span>
								{i.product.name} × {i.quantity}
								<small>Size {i.size}</small>
							</span>
							<strong>{formatMoney(i.product.price * i.quantity)}</strong>
						</div>
					))}
					<div>
						<span>Subtotal</span>
						<strong>{formatMoney(subtotal)}</strong>
					</div>
					<div>
						<span>Delivery</span>
						<strong>{shipping === 0 ? 'Free' : formatMoney(shipping)}</strong>
					</div>
					<div className="total">
						<span>Total</span>
						<strong>{formatMoney(subtotal + shipping)}</strong>
					</div>
					{serverError && (
						<p className="form-error" role="alert">
							{serverError}
						</p>
					)}
					<Button disabled={busy} type="submit">
						{busy ? 'Placing order…' : 'Place order'}
					</Button>
					<p>No online charge is taken. Payment is arranged after confirmation.</p>
				</aside>
			</form>
		</div>
	);
}
