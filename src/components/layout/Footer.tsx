import { Link } from 'react-router-dom';
import { FaFacebookF, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';

// internal imports
import { businessConfig, whatsappUrl } from '../../config/business';

// footer
export function Footer() {
	return (
		<footer>
			<div className="container footer-grid">
				<div>
					<Link className="logo light" to="/">
						FATCO GH<span>.</span>
					</Link>
					<p>{businessConfig.description}</p>
					<div className="footer-social" aria-label="Fatco GH social media">
						<a
							href={businessConfig.social.facebook}
							target="_blank"
							rel="noreferrer"
							aria-label="Follow Fatco GH on Facebook"
						>
							<FaFacebookF />
						</a>
						<a
							href={whatsappUrl()}
							target="_blank"
							rel="noreferrer"
							aria-label="Chat with Fatco GH on WhatsApp"
						>
							<FaWhatsapp />
						</a>
					</div>
				</div>
				<div>
					<h3>Explore</h3>
					<Link to="/shop">Shop all</Link>
					<Link to="/about">Our story</Link>
					<Link to="/contact">Contact</Link>
				</div>
				<div>
					<h3>Visit us</h3>
					<p>
						{businessConfig.address}
						<br />
						{businessConfig.city}
					</p>
					<a href={whatsappUrl()} target="_blank" rel="noreferrer">
						WhatsApp us
					</a>
				</div>
				<div>
					<h3>Contact</h3>
					<a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
					<p>{businessConfig.phone}</p>
				</div>
			</div>
			<div className="container copyright">
				© {new Date().getFullYear()} Fatco GH. Club marks belong to their owners.
			</div>
		</footer>
	);
}
