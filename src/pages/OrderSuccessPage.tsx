import { useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

// internal imports
import { Seo } from '../components/products/Seo';
import { ButtonLink } from '../components/ui/Button';
import { businessConfig } from '../config/business';
import { formatMoney } from '../lib/format';
import type { Order } from '../types/store';

// order success page
export function OrderSuccessPage() {
	const order = (useLocation().state as { order?: Order } | null)?.order;

	if (!order)
		return (
			<div className="container page state">
				<h1>No recent order</h1>
				<p>Order confirmation details appear here after a completed checkout.</p>
				<ButtonLink to="/shop">Return to shop</ButtonLink>
			</div>
		);

	return (
		<div className="container page success">
			<Seo
				title={`Order ${order.order_number} | Fatco GH`}
				description="Your Fatco GH order confirmation."
			/>

			<CheckCircle2 />

			<p className="eyebrow">Order received</p>
			<h1>Thanks, {order.customer_name}.</h1>
			<p>
				We have received order <strong>{order.order_number}</strong>. Fatco GH will contact you on{' '}
				{order.phone} to confirm availability, delivery and manual payment.
			</p>

			<div className="success-card">
				<h2>Order details</h2>
				{order.items.map((item) => (
					<div key={`${item.product_id}-${item.size}`}>
						<span>
							{item.product_name} · {item.size} × {item.quantity}
						</span>
						<strong>{formatMoney(item.subtotal)}</strong>
					</div>
				))}

				<div className="total">
					<span>Total</span>
					<strong>{formatMoney(order.total_amount)}</strong>
				</div>
			</div>

			<p>
				Questions? Email <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>.
			</p>
			<ButtonLink to="/shop">Keep browsing</ButtonLink>
		</div>
	);
}
