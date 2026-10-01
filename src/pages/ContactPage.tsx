import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

// internal imports
import { Seo } from '../components/products/Seo';
import { Button, ButtonLink } from '../components/ui/Button';
import { businessConfig, whatsappUrl } from '../config/business';

// contact page
export function ContactPage() {
	return (
		<div className="container page">
			<Seo
				title="Contact Fatco GH | Accra"
				description="Contact Fatco GH about football jerseys, store pickup and delivery in Ghana."
			/>
			<header className="page-header">
				<p className="eyebrow">Talk to us</p>
				<h1>Contact Fatco GH</h1>
				<p>Ask about a shirt, sizing, store pickup or delivery.</p>
			</header>
			<div className="contact-grid">
				<div className="contact-details">
					<div>
						<MapPin />
						<span>
							<strong>Visit the store</strong>
							{businessConfig.address}
							<br />
							{businessConfig.city}
						</span>
					</div>
					<div>
						<Phone />
						<span>
							<strong>Call</strong>
							{businessConfig.phone}
						</span>
					</div>
					<div>
						<Mail />
						<span>
							<strong>Email</strong>
							<a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
						</span>
					</div>
					<div>
						<MessageCircle />
						<span>
							<strong>Opening hours</strong>
							{businessConfig.openingHours.map((hours) => (
								<span key={hours}>{hours}</span>
							))}
						</span>
					</div>
					<ButtonLink to={whatsappUrl()} target="_blank">
						Chat on WhatsApp
					</ButtonLink>
					<div className="map-embed">
						<iframe
							title="Fatco GH location in Accra"
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122103.21451859894!2d-0.2621315949898593!3d5.591202954249625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e1!3m2!1sen!2ses!4v1787903353597!5m2!1sen!2ses"
							loading="lazy"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						/>
					</div>
				</div>

				<form
					className="form-card"
					action="https://formsubmit.co/69fa7e73e99eab31c73152146cc152df"
					method="post"
				>
					<h2>Send a message</h2>
					<input type="hidden" name="_subject" value="New message from the Fatco GH website" />
					<input type="hidden" name="_template" value="table" />
					<input
						type="text"
						name="_honey"
						tabIndex={-1}
						autoComplete="off"
						aria-hidden="true"
						style={{ display: 'none' }}
					/>
					<label>
						Name
						<input type="text" name="name" minLength={2} autoComplete="name" required />
					</label>
					<label>
						Email
						<input type="email" name="email" autoComplete="email" required />
					</label>
					<label>
						Phone
						<input type="tel" name="phone" minLength={7} autoComplete="tel" required />
					</label>
					<label>
						Message
						<textarea name="message" rows={6} minLength={10} required />
					</label>
					<Button type="submit">Send message</Button>
				</form>
			</div>
		</div>
	);
}
