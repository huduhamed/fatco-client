import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// internal imports
import { Layout } from './components/layout/Layout';
import { AboutPage } from './pages/AboutPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { ProductPage } from './pages/ProductPage';
import { ShopPage } from './pages/ShopPage';

// admin page
const AdminPage = lazy(() =>
	import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })),
);

// router
const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: 'shop', element: <ShopPage /> },
			{ path: 'shop/:slug', element: <ProductPage /> },
			{ path: 'about', element: <AboutPage /> },
			{ path: 'contact', element: <ContactPage /> },
			{ path: 'cart', element: <CartPage /> },
			{ path: 'checkout', element: <CheckoutPage /> },
			{ path: 'order-success', element: <OrderSuccessPage /> },
			{ path: '*', element: <NotFoundPage /> },
		],
	},
	{
		path: '/admin/*',
		element: (
			<Suspense
				fallback={
					<div className="state page">
						<p>Loading admin…</p>
					</div>
				}
			>
				<AdminPage />
			</Suspense>
		),
	},
]);

// app
function App() {
	return <RouterProvider router={router} />;
}

export default App;
