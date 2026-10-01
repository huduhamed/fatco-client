import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

// internal imports
import { ProductGrid } from '../components/products/ProductCard';
import { Seo } from '../components/products/Seo';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { productService } from '../services/api';

// categories
const categories = [
	'All',
	'Club Jerseys',
	'National Team Jerseys',
	'Retro Jerseys',
	'Training Wear',
	'Accessories',
];

// shop page
export function ShopPage() {
	const [params, setParams] = useSearchParams();
	const [sort, setSort] = useState('featured');
	const category = params.get('category') || 'All';
	const {
		data = [],
		isLoading,
		error,
	} = useQuery({ queryKey: ['products'], queryFn: productService.list });
	const products = useMemo(() => {
		let rows = category === 'All' ? data : data.filter((p) => p.category === category);
		return [...rows].sort((a, b) =>
			sort === 'low'
				? a.price - b.price
				: sort === 'high'
					? b.price - a.price
					: Number(b.is_featured) - Number(a.is_featured),
		);
	}, [data, category, sort]);
	return (
		<div className="container page">
			<Seo
				title="Shop Football Jerseys | Fatco"
				description="Browse Fatco's current demo catalogue of club, national team and retro football jerseys."
			/>
			<header className="page-header">
				<p className="eyebrow">Current collection</p>
				<h1>Shop jerseys</h1>
				<p>Looking for a specific team or jersey? Contact us to place a special order today!</p>
			</header>
			<div className="shop-toolbar">
				<div className="filter-pills" aria-label="Filter by category">
					{categories.map((c) => (
						<button
							className={category === c ? 'active' : ''}
							onClick={() => {
								if (c === 'All') setParams({});
								else setParams({ category: c });
							}}
							key={c}
						>
							{c}
						</button>
					))}
				</div>
				<label>
					Sort{' '}
					<select value={sort} onChange={(e) => setSort(e.target.value)}>
						<option value="featured">Featured</option>
						<option value="low">Price: low to high</option>
						<option value="high">Price: high to low</option>
					</select>
				</label>
			</div>
			{isLoading ? (
				<LoadingState count={8} />
			) : error ? (
				<ErrorState message={(error as Error).message} />
			) : products.length ? (
				<ProductGrid products={products} />
			) : (
				<EmptyState title="No jerseys found" message="Try another category or check back soon." />
			)}
		</div>
	);
}
