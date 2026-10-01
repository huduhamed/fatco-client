// internal imports
import { ButtonLink } from '../components/ui/Button';
import { Seo } from '../components/products/Seo';

// about page
export function AboutPage() {
	return (
		<>
			<Seo
				title="About Fatco GH | Accra Football Jersey Store"
				description="Meet Fatco GH, an independent football jersey retailer based in Accra, Ghana."
			/>
			<section className="story-hero">
				<div className="container">
					<p className="eyebrow gold">Our story</p>
					<h1>
						For the love of
						<br />
						the Game
					</h1>
				</div>
			</section>
			<section className="container story">
				<div>
					<p className="eyebrow">Fatco GH · Accra</p>
					<h2>Football culture, close to home.</h2>
				</div>
				<div>
					<p>
						Fatco GH is an independent jersey store built for supporters in Accra and across Ghana.
						The idea is simple: make it easy to see what is available, understand the price and
						order the right size.
					</p>
					<p>
						At Fatco GH, we believe a jersey is more than something you wear — it’s a way to
						represent your club, your country, and the game you love. From matchday in Accra to
						football conversations across Ghana, we’re here to help you wear your colours with
						pride.
					</p>
					<ButtonLink to="/shop">Explore jerseys</ButtonLink>
				</div>
			</section>
		</>
	);
}
