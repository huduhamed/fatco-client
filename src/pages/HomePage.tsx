import { ArrowRight, BadgeCheck, MapPin, MessageCircle, WalletCards } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// internal imports
import { ProductGrid } from '../components/products/ProductCard';
import { Seo } from '../components/products/Seo';
import { ButtonLink } from '../components/ui/Button';
import { LoadingState } from '../components/ui/States';
import { productService } from '../services/api';

// categories
const categories = [
	['Club Jerseys', 'Current shirts from popular clubs.'],
	['National Team Jerseys', 'Represent Ghana and nations you love.'],
	['Retro Jerseys', 'Classic football style from past seasons.'],
	['Training Wear', 'Easy layers for training and everyday wear.'],
];

// benefits
const benefits = [
	[BadgeCheck, 'Quality jerseys', 'Clear product details and real availability.'],
	[WalletCards, 'Straightforward prices', 'Prices shown in Ghana cedis, without surprises.'],
	[MapPin, 'Based in Accra', 'Pickup and local delivery options.'],
	[MessageCircle, 'Easy ordering', 'Order online or speak to us on WhatsApp.'],
] as const;

// homepage
export function HomePage() {
	const [heroPick, setHeroPick] = useState(() => Math.random());
	const { data, isLoading } = useQuery({
		queryKey: ['products', 'featured'],
		queryFn: productService.featured,
	});
	const featured = data ?? [];
	const heroProduct = featured[Math.floor(heroPick * featured.length)];

	useEffect(() => {
		if (featured.length < 2) return;

		const rotation = window.setInterval(
			() => {
				setHeroPick((currentPick) => {
					const currentIndex = Math.floor(currentPick * featured.length);
					const nextIndex =
						(currentIndex + 1 + Math.floor(Math.random() * (featured.length - 1))) %
						featured.length;
					return (nextIndex + 0.5) / featured.length;
				});
			},
			3 * 60 * 1000,
		);
		return () => window.clearInterval(rotation);
	}, [featured.length]);

	return (
		<>
			<Seo
				title="Fatco GH | Football Jerseys in Accra"
				description="Shop different football jerseys from Fatco GH, an independent jersey store in Accra, Ghana."
			/>

			<section className="hero">
				<div className="container hero-grid">
					<div className="hero-copy">
						<p className="eyebrow gold">Independent jersey store · Accra</p>
						<h1>
							Your Shirt
							<br />
							Your Club
							<br />
							<em>Your Game</em>
						</h1>
						<p>
							Fresh football shirts for match day, five-a-side and everywhere in between. Browse
							what is available, choose your size, and order simply.
						</p>
						<div className="button-row">
							<ButtonLink to="/shop">
								Shop Jerseys <ArrowRight size={18} />
							</ButtonLink>
							<ButtonLink to="/contact" variant="secondary">
								Contact Us
							</ButtonLink>
						</div>
					</div>

					<div className="hero-visual">
						{heroProduct && (
							<Link to={`/shop/${heroProduct.slug}`} aria-label={`View ${heroProduct.name}`}>
								<img src={heroProduct.image_url} alt={heroProduct.name} />
								<div className="hero-label">
									<span>Featured now</span>
									<strong>{heroProduct.name}</strong>
								</div>
							</Link>
						)}
					</div>
				</div>
			</section>
			<section className="section">
				<div className="container">
					<div className="section-heading">
						<div>
							<p className="eyebrow">The starting XI</p>
							<h2>Featured jerseys</h2>
						</div>
						<ButtonLink to="/shop" variant="ghost">
							View all <ArrowRight size={17} />
						</ButtonLink>
					</div>
					{isLoading ? <LoadingState /> : <ProductGrid products={featured} />}
				</div>
			</section>

			<section className="section alt">
				<div className="container">
					<div className="section-heading">
						<div>
							<p className="eyebrow">Find your colours</p>
							<h2>Shop by category</h2>
						</div>
					</div>
					<div className="category-grid">
						{categories.map(([name, description], index) => (
							<ButtonLink
								to={`/shop?category=${encodeURIComponent(name)}`}
								variant="ghost"
								className={`category category-${index + 1}`}
								key={name}
							>
								<span>0{index + 1}</span>
								<h3>{name}</h3>
								<p>{description}</p>
								<ArrowRight />
							</ButtonLink>
						))}
					</div>
				</div>
			</section>

			<section className="section">
				<div className="container">
					<div className="section-heading">
						<div>
							<p className="eyebrow">Why Fatco GH</p>
							<h2>Football shirts made simple.</h2>
						</div>
					</div>
					<div className="benefit-grid">
						{benefits.map(([Icon, title, text]) => (
							<div className="benefit" key={title}>
								<Icon />
								<h3>{title}</h3>
								<p>{text}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="container final-cta">
				<p className="eyebrow gold">Ready for kick-off?</p>
				<h2>Find the shirt you’ll wear on repeat.</h2>
				<ButtonLink to="/shop">
					Browse the collection <ArrowRight size={18} />
				</ButtonLink>
			</section>
		</>
	);
}
