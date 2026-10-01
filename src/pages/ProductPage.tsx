import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Check, ChevronLeft, Minus, Plus, ShoppingBag } from 'lucide-react';

// internal imports
import { Seo } from '../components/products/Seo';
import { Button } from '../components/ui/Button';
import { ErrorState, LoadingState } from '../components/ui/States';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../lib/format';
import { productService } from '../services/api';

// product page
export function ProductPage() {
	const { slug = '' } = useParams();
	const {
		data: p,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['product', slug],
		queryFn: () => productService.bySlug(slug),
		retry: false,
	});
	const [size, setSize] = useState('');
	const [qty, setQty] = useState(1);
	const [added, setAdded] = useState(false);
	const { add } = useCart();

	if (isLoading)
		return (
			<div className="container page">
				<LoadingState count={2} />
			</div>
		);
	if (error || !p)
		return (
			<div className="container page">
				<ErrorState message="That jersey could not be found." />
			</div>
		);
	const available = p.is_available && p.stock_quantity > 0;
	const chosen = size || p.sizes[0];

	return (
		<div className="container page">
			<Seo title={`${p.name} | Fatco`} description={p.description} />
			<Link className="back-link" to="/shop">
				<ChevronLeft size={17} /> Back to shop
			</Link>
			<div className="product-detail">
				<div className="gallery">
					<img src={p.image_url} alt={`${p.name} demo product`} />
					{p.additional_images.map((src) => (
						<img src={src} alt={`${p.name} additional view`} key={src} />
					))}
				</div>
				<div className="product-copy">
					<p className="eyebrow">
						{p.category} · {p.season}
					</p>
					<h1>{p.name}</h1>
					<p className="price">{formatMoney(p.price, p.currency)}</p>
					<p className={available ? 'stock in' : 'stock out'}>
						{available ? (
							<>
								<Check size={17} /> In stock — {p.stock_quantity} available
							</>
						) : (
							'Currently unavailable'
						)}
					</p>

					<p className="description">{p.description}</p>

					<fieldset>
						<legend>Choose size</legend>
						<div className="size-row">
							{p.sizes.map((s) => (
								<button
									type="button"
									className={chosen === s ? 'selected' : ''}
									onClick={() => setSize(s)}
									key={s}
								>
									{s}
								</button>
							))}
						</div>
					</fieldset>

					<div className="purchase-row">
						<div className="quantity">
							<button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
								<Minus />
							</button>
							<span>{qty}</span>
							<button
								onClick={() => setQty(Math.min(p.stock_quantity, qty + 1))}
								aria-label="Increase quantity"
							>
								<Plus />
							</button>
						</div>
						<Button
							disabled={!available}
							onClick={() => {
								add(p, chosen, qty);
								setAdded(true);
							}}
						>
							<ShoppingBag size={18} />
							{added ? 'Added to cart' : 'Add to cart'}
						</Button>
					</div>

					<p className="fine-print">Confirm product details and availability before purchase.</p>
				</div>
			</div>
		</div>
	);
}
