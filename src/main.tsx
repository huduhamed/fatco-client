import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// internal imports
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext.tsx';
import './styles/global.css';

// query client
const queryClient = new QueryClient({
	defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<CartProvider>
				<App />
			</CartProvider>
		</QueryClientProvider>
	</StrictMode>,
);
