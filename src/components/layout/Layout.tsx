import { Outlet, ScrollRestoration } from 'react-router-dom';

// internal imports
import { Footer } from './Footer';
import { Navbar } from './Navbar';

// layout
export function Layout() {
	return (
		<>
			<a href="#main" className="skip-link">
				Skip to content
			</a>
			<Navbar />
			<main id="main">
				<Outlet />
			</main>
			<Footer />
			<ScrollRestoration />
		</>
	);
}
