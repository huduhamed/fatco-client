import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// internal imports
import { useCart } from '../../context/CartContext';

// navbar
export function Navbar() {
	const [open, setOpen] = useState(false);
	const { count } = useCart();

	return (
		<header className="navbar">
			<div className="container nav-inner">
				<Link to="/" className="brand-logo" aria-label="Fatco GH home">
					<img src="/images/brand/fatco-logo.png" alt="FATCO GH" />
				</Link>
				<button
					className="menu-button"
					onClick={() => setOpen(!open)}
					aria-label="Toggle navigation"
					aria-expanded={open}
				>
					{open ? <X /> : <Menu />}
				</button>
				<nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
					{[
						['/shop', 'Shop'],
						['/about', 'About'],
						['/contact', 'Contact'],
					].map(([to, label]) => (
						<NavLink key={to} to={to} onClick={() => setOpen(false)}>
							{label}
						</NavLink>
					))}
					<NavLink to="/cart" className="cart-link" onClick={() => setOpen(false)}>
						<ShoppingBag size={20} /> Cart {count > 0 && <span>{count}</span>}
					</NavLink>
				</nav>
			</div>
		</header>
	);
}
