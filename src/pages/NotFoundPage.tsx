// internal imports
import { ButtonLink } from '../components/ui/Button';

// not found page
export function NotFoundPage() {
	return (
		<div className="container page state">
			<p className="eyebrow">404</p>
			<h1>That page is offside.</h1>
			<p>We could not find the page you requested.</p>
			<ButtonLink to="/shop">Back to the shop</ButtonLink>
		</div>
	);
}
