import { useEffect, useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { LogOut, Package, Plus, ReceiptText } from 'lucide-react';

// internal importsd
import { Button, ButtonLink } from '../components/ui/Button';
import { ErrorState, LoadingState } from '../components/ui/States';
import { isSupabaseAuthConfigured, supabase } from '../lib/supabase';
import { adminService } from '../services/api';
import type { Category, Order, Product } from '../types/store';

type ProductDraft = Pick<
	Product,
	| 'name'
	| 'slug'
	| 'description'
	| 'team'
	| 'category'
	| 'season'
	| 'price'
	| 'currency'
	| 'image_url'
	| 'additional_images'
	| 'sizes'
	| 'stock_quantity'
	| 'is_available'
	| 'is_featured'
>;

//empty products
const emptyProduct: ProductDraft = {
	name: '',
	slug: '',
	description: '',
	team: '',
	category: 'Club Jerseys',
	season: '2025/26',
	price: 0,
	currency: 'GHS',
	image_url: '/images/brand/fatco-icon.png',
	additional_images: [],
	sizes: ['S', 'M', 'L', 'XL'],
	stock_quantity: 0,
	is_available: true,
	is_featured: false,
};
// categories
const categories: Category[] = [
	'Club Jerseys',
	'National Team Jerseys',
	'Retro Jerseys',
	'Training Wear',
	'Accessories',
];

const MAX_IMAGE_BYTES = 300 * 1024;

// login
function Login({ onLogin }: { onLogin: (token: string) => void }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	async function submit(event: FormEvent) {
		event.preventDefault();
		if (!supabase) return;
		const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
		if (authError || !data.session) setError(authError?.message ?? 'Unable to sign in');
		else onLogin(data.session.access_token);
	}
	if (!isSupabaseAuthConfigured)
		return (
			<div className="admin-login">
				<h1>Admin setup required</h1>
				<p>Add the Supabase frontend variables to enable secure admin sign-in.</p>
				<ButtonLink to="/">Back to store</ButtonLink>
			</div>
		);
	return (
		<form className="admin-login form-card" onSubmit={submit}>
			<div className="logo">
				FATCO GH<span>.</span>
			</div>
			<h1>Store admin</h1>
			<label>
				Email
				<input
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
				/>
			</label>
			<label>
				Password
				<input
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
				/>
			</label>
			{error && (
				<p className="form-error" role="alert">
					{error}
				</p>
			)}
			<Button>Sign in</Button>
		</form>
	);
}

// admin shell
function AdminShell({ token, logout }: { token: string; logout: () => void }) {
	return (
		<div className="admin-shell">
			<aside>
				<Link className="logo light" to="/admin/products">
					FATCO GH<span>.</span>
				</Link>
				<nav>
					<Link to="/admin/products">
						<Package /> Products
					</Link>
					<Link to="/admin/orders">
						<ReceiptText /> Orders
					</Link>
					<Link to="/">View store</Link>
				</nav>
				<button onClick={logout}>
					<LogOut /> Sign out
				</button>
			</aside>
			<main>
				<Routes>
					<Route index element={<Navigate to="products" replace />} />
					<Route path="products" element={<Products token={token} />} />
					<Route path="products/new" element={<ProductEditor token={token} />} />
					<Route path="products/:id/edit" element={<ProductEditor token={token} />} />
					<Route path="orders" element={<Orders token={token} />} />
				</Routes>
			</main>
		</div>
	);
}

// products
function Products({ token }: { token: string }) {
	const client = useQueryClient();
	const query = useQuery({
		queryKey: ['admin-products'],
		queryFn: () => adminService.products(token),
	});
	const [actionError, setActionError] = useState('');
	const [deleting, setDeleting] = useState('');

	async function remove(product: Product) {
		if (!window.confirm(`Delete “${product.name}” permanently?`)) return;
		setDeleting(product.id);
		setActionError('');
		try {
			await adminService.deleteProduct(token, product.id);
			await client.invalidateQueries({ queryKey: ['admin-products'] });
			await client.invalidateQueries({ queryKey: ['products'] });
		} catch (error) {
			setActionError((error as Error).message);
		} finally {
			setDeleting('');
		}
	}
	return (
		<div className="admin-page">
			<header>
				<div>
					<p className="eyebrow">Inventory</p>
					<h1>Products</h1>
				</div>
				<ButtonLink to="/admin/products/new">
					<Plus /> Add product
				</ButtonLink>
			</header>
			{actionError && (
				<p className="form-error" role="alert">
					{actionError}
				</p>
			)}
			{query.isLoading ? (
				<LoadingState />
			) : query.error ? (
				<ErrorState message={(query.error as Error).message} />
			) : query.data?.length ? (
				<div className="admin-table-wrap">
					<table>
						<thead>
							<tr>
								<th>Product</th>
								<th>Price</th>
								<th>Stock</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{query.data.map((product) => (
								<tr key={product.id}>
									<td>
										<img src={product.image_url} alt="" />
										<span>
											<strong>{product.name}</strong>
											<small>
												{product.team} · {product.season}
											</small>
										</span>
									</td>
									<td>GHS {product.price}</td>
									<td>{product.stock_quantity}</td>
									<td>
										{product.is_available ? 'Available' : 'Unavailable'}
										{product.is_featured ? ' · Featured' : ''}
									</td>
									<td>
										<Link to={`/admin/products/${product.id}/edit`}>Edit</Link>{' '}
										<button disabled={deleting === product.id} onClick={() => remove(product)}>
											{deleting === product.id ? 'Deleting…' : 'Delete'}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="state">
					<h2>No database products yet</h2>
					<p>Add your first product or run the Prisma seed command.</p>
					<ButtonLink to="/admin/products/new">Add product</ButtonLink>
				</div>
			)}
		</div>
	);
}

// product editor
function ProductEditor({ token }: { token: string }) {
	const { id } = useParams();
	const query = useQuery({
		queryKey: ['admin-products'],
		queryFn: () => adminService.products(token),
		enabled: Boolean(id),
	});
	if (id && query.isLoading)
		return (
			<div className="admin-page">
				<LoadingState />
			</div>
		);
	if (id && query.error)
		return (
			<div className="admin-page">
				<ErrorState message={(query.error as Error).message} />
			</div>
		);
	const product = id ? query.data?.find((item) => item.id === id) : undefined;
	if (id && !product)
		return (
			<div className="admin-page">
				<ErrorState message="This database product could not be found." />
			</div>
		);
	return (
		<ProductForm
			key={product?.id ?? 'new'}
			token={token}
			id={id}
			initial={product ?? emptyProduct}
		/>
	);
}

// product form
function ProductForm({
	token,
	id,
	initial,
}: {
	token: string;
	id?: string;
	initial: ProductDraft;
}) {
	const navigate = useNavigate();
	const client = useQueryClient();
	const [form, setForm] = useState<ProductDraft>(initial);
	const [sizes, setSizes] = useState(initial.sizes.join(', '));
	const [error, setError] = useState('');
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);

	function update<K extends keyof ProductDraft>(name: K, value: ProductDraft[K]) {
		setForm((current) => ({ ...current, [name]: value }));
	}

	async function submit(event: FormEvent) {
		event.preventDefault();
		setSaving(true);
		setError('');
		const payload: ProductDraft = {
			...form,
			sizes: sizes
				.split(',')
				.map((size) => size.trim())
				.filter(Boolean),
		};

		try {
			if (id) await adminService.updateProduct(token, id, payload);
			else await adminService.createProduct(token, payload);
			await client.invalidateQueries({ queryKey: ['admin-products'] });
			await client.invalidateQueries({ queryKey: ['products'] });
			navigate('/admin/products');
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	}

	async function uploadImage(file?: File) {
		if (!file) return;
		setError('');
		if (file.size > MAX_IMAGE_BYTES) {
			setError('Image exceeds the maximum size of 300 KB.');
			return;
		}
		if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
			setError('Use a JPG, PNG, WebP, or AVIF image.');
			return;
		}
		setUploading(true);
		try {
			const result = await adminService.uploadImage(token, file);
			update('image_url', result.url);
		} catch (uploadError) {
			setError((uploadError as Error).message);
		} finally {
			setUploading(false);
		}
	}

	return (
		<div className="admin-page">
			<header>
				<div>
					<p className="eyebrow">Inventory</p>
					<h1>{id ? 'Edit product' : 'New product'}</h1>
				</div>
			</header>
			<form className="form-card product-form" onSubmit={submit}>
				<div className="form-grid">
					<label>
						Name
						<input
							value={form.name}
							onChange={(event) => update('name', event.target.value)}
							required
						/>
					</label>
					<label>
						Slug
						<input
							value={form.slug}
							onChange={(event) =>
								update(
									'slug',
									event.target.value
										.toLowerCase()
										.replace(/[^a-z0-9]+/g, '-')
										.replace(/^-|-$/g, ''),
								)
							}
							required
						/>
					</label>
					<label>
						Team
						<input
							value={form.team}
							onChange={(event) => update('team', event.target.value)}
							required
						/>
					</label>
					<label>
						Season
						<input
							value={form.season}
							onChange={(event) => update('season', event.target.value)}
							required
						/>
					</label>
					<label>
						Price (GHS)
						<input
							type="number"
							min="0"
							step="0.01"
							value={form.price}
							onChange={(event) => update('price', Number(event.target.value))}
							required
						/>
					</label>
					<label>
						Stock
						<input
							type="number"
							min="0"
							step="1"
							value={form.stock_quantity}
							onChange={(event) => update('stock_quantity', Number(event.target.value))}
							required
						/>
					</label>
					<label className="wide">
						Upload main image (maximum 300 KB)
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp,image/avif"
							disabled={uploading}
							onChange={(event) => void uploadImage(event.target.files?.[0])}
						/>
						<small>
							{uploading
								? 'Uploading…'
								: 'JPG, PNG, WebP or AVIF. Images over 300 KB are rejected.'}
						</small>
					</label>
					<label className="wide">
						Main image URL
						<input
							value={form.image_url}
							onChange={(event) => update('image_url', event.target.value)}
							required
						/>
					</label>
					<label>
						Category
						<select
							value={form.category}
							onChange={(event) => update('category', event.target.value as Category)}
						>
							{categories.map((category) => (
								<option key={category}>{category}</option>
							))}
						</select>
					</label>
					<label>
						Sizes (comma separated)
						<input value={sizes} onChange={(event) => setSizes(event.target.value)} required />
					</label>
					<label className="wide">
						Description
						<textarea
							rows={5}
							value={form.description}
							onChange={(event) => update('description', event.target.value)}
							required
						/>
					</label>
					<label className="checkbox">
						<input
							type="checkbox"
							checked={form.is_available}
							onChange={(event) => update('is_available', event.target.checked)}
						/>{' '}
						Available
					</label>
					<label className="checkbox">
						<input
							type="checkbox"
							checked={form.is_featured}
							onChange={(event) => update('is_featured', event.target.checked)}
						/>{' '}
						Featured
					</label>
				</div>
				{error && (
					<p className="form-error" role="alert">
						{error}
					</p>
				)}
				<div className="button-row">
					<Button disabled={saving || uploading}>{saving ? 'Saving…' : 'Save product'}</Button>
					<ButtonLink variant="secondary" to="/admin/products">
						Cancel
					</ButtonLink>
				</div>
			</form>
		</div>
	);
}

// orders
function Orders({ token }: { token: string }) {
	const query = useQuery({ queryKey: ['admin-orders'], queryFn: () => adminService.orders(token) });
	return (
		<div className="admin-page">
			<header>
				<div>
					<p className="eyebrow">Sales</p>
					<h1>Orders</h1>
				</div>
			</header>
			{query.isLoading ? (
				<LoadingState />
			) : query.error ? (
				<ErrorState message={(query.error as Error).message} />
			) : query.data?.length ? (
				<div className="admin-table-wrap">
					<table>
						<thead>
							<tr>
								<th>Order</th>
								<th>Customer</th>
								<th>Total</th>
								<th>Status</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{query.data.map((order: Order) => (
								<tr key={order.id}>
									<td>
										<strong>{order.order_number}</strong>
									</td>
									<td>
										{order.customer_name}
										<small>{order.phone}</small>
									</td>
									<td>GHS {order.total_amount}</td>
									<td>{order.status}</td>
									<td>{new Date(order.created_at).toLocaleDateString('en-GH')}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p>No orders yet.</p>
			)}
		</div>
	);
}

// admin page
export function AdminPage() {
	const [token, setToken] = useState(() => sessionStorage.getItem('fatco-admin-token') ?? '');

	useEffect(() => {
		if (!supabase) return;

		void supabase.auth.getSession().then(({ data }) => {
			const accessToken = data.session?.access_token ?? '';
			if (accessToken) sessionStorage.setItem('fatco-admin-token', accessToken);
			else sessionStorage.removeItem('fatco-admin-token');
			setToken(accessToken);
		});

		const { data } = supabase.auth.onAuthStateChange((_event, session) => {
			const accessToken = session?.access_token ?? '';
			if (accessToken) sessionStorage.setItem('fatco-admin-token', accessToken);
			else sessionStorage.removeItem('fatco-admin-token');
			setToken(accessToken);
		});

		return () => data.subscription.unsubscribe();
	}, []);

	function login(value: string) {
		sessionStorage.setItem('fatco-admin-token', value);
		setToken(value);
	}
	async function logout() {
		await supabase?.auth.signOut();
		sessionStorage.removeItem('fatco-admin-token');
		setToken('');
	}
	return token ? <AdminShell token={token} logout={logout} /> : <Login onLogin={login} />;
}
