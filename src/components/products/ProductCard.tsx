import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

// internal imports
import { useCart } from '../../context/CartContext';
import { formatMoney } from '../../lib/format';
import type { Product } from '../../types/store';

// product card
export function ProductCard({ product }: { product: Product }) {
	const { add } = useCart();
	const available = product.is_available && product.stock_quantity > 0;

	return (
		<article className="product-card">
			<Link to={`/shop/${product.slug}`} className="product-image">
				<img src={product.image_url} alt={`${product.name} demo product`} />
				{!available && <span className="badge unavailable">Unavailable</span>}
			</Link>
			<div className="product-info">
				<p className="eyebrow">
					{product.team} · {product.season}
				</p>
				<h3>
					<Link to={`/shop/${product.slug}`}>{product.name}</Link>
				</h3>
				<div className="product-bottom">
					<strong>{formatMoney(product.price, product.currency)}</strong>
					<button
						disabled={!available}
						onClick={() => add(product, product.sizes[0])}
						aria-label={`Add ${product.name} in size ${product.sizes[0]} to cart`}
					>
						<ShoppingBag size={18} />
					</button>
				</div>
			</div>
		</article>
	);
}

// product grid
export function ProductGrid({ products }: { products: Product[] }) {
	return (
		<div className="product-grid">
			{products.map((p) => (
				<ProductCard product={p} key={p.id} />
			))}
		</div>
	);
}
