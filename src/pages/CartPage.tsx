import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// internal imports
import { Seo } from '../components/products/Seo';
import { ButtonLink } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../lib/format';

// cart page
export function CartPage() {
	const { items, subtotal, remove, update } = useCart();

	if (!items.length)
		return (
			<div className="container page state">
				<Seo title="Your Cart | Fatco" description="Review your Fatco shopping cart." />
				<h1>Your cart is empty.</h1>
				<p>Explore our jerseys and find your next shirt.</p>
				<ButtonLink to="/shop">Shop Jerseys</ButtonLink>
			</div>
		);

	return (
		<div className="container page">
			<Seo title="Your Cart | Fatco" description="Review your Fatco shopping cart." />
			<header className="page-header compact">
				<p className="eyebrow">Your selection</p>
				<h1>Shopping cart</h1>
			</header>
			<div className="cart-layout">
				<div className="cart-items">
					{items.map(({ product, size, quantity }) => (
						<article className="cart-item" key={`${product.id}-${size}`}>
							<Link to={`/shop/${product.slug}`}>
								<img src={product.image_url} alt="" />
							</Link>
							<div className="cart-item-copy">
								<h2>
									<Link to={`/shop/${product.slug}`}>{product.name}</Link>
								</h2>
								<p>Size: {size}</p>
								<strong>{formatMoney(product.price)}</strong>
								<div className="quantity small">
									<button
										onClick={() => update(product.id, size, quantity - 1)}
										aria-label="Decrease quantity"
									>
										<Minus />
									</button>
									<span>{quantity}</span>
									<button
										onClick={() => update(product.id, size, quantity + 1)}
										aria-label="Increase quantity"
									>
										<Plus />
									</button>
								</div>
							</div>
							<button
								className="remove"
								onClick={() => remove(product.id, size)}
								aria-label={`Remove ${product.name}`}
							>
								<Trash2 />
							</button>
						</article>
					))}
				</div>
				<aside className="summary">
					<h2>Order summary</h2>
					<div>
						<span>Subtotal</span>
						<strong>{formatMoney(subtotal)}</strong>
					</div>
					<div>
						<span>Delivery</span>
						<span>Calculated at checkout</span>
					</div>
					<div className="total">
						<span>Estimated total</span>
						<strong>{formatMoney(subtotal)}</strong>
					</div>
					<ButtonLink to="/checkout">Continue to checkout</ButtonLink>
					<p>Payment arrangements are confirmed after ordering.</p>
				</aside>
			</div>
		</div>
	);
}
