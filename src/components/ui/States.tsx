import { AlertCircle } from 'lucide-react';

// internal imports
import { ButtonLink } from './Button';

// loading state
export function LoadingState({ count = 4 }: { count?: number }) {
	return (
		<div className="product-grid" aria-label="Loading products">
			{Array.from({ length: count }, (_, i) => (
				<div className="skeleton" key={i} />
			))}
		</div>
	);
}

// error state
export function ErrorState({ message = 'We could not load this content.' }: { message?: string }) {
	return (
		<div className="state">
			<AlertCircle />
			<h2>Something went wrong</h2>
			<p>{message}</p>
			<ButtonLink to="/shop">Back to shop</ButtonLink>
		</div>
	);
}

// empty state
export function EmptyState({
	title = 'Nothing here yet',
	message = 'Check back soon.',
}: {
	title?: string;
	message?: string;
}) {
	return (
		<div className="state">
			<h2>{title}</h2>
			<p>{message}</p>
			<ButtonLink to="/shop">Shop Jerseys</ButtonLink>
		</div>
	);
}
