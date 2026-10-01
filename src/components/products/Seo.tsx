import { useEffect } from 'react';

// SEO
export function Seo({ title, description }: { title: string; description: string }) {
	useEffect(() => {
		const brandedTitle = title.replace(/Fatco(?! GH)/g, 'Fatco GH');
		const brandedDescription = description.replace(/Fatco(?! GH)/g, 'Fatco GH');
		document.title = brandedTitle;
		const values = [
			['meta[name="description"]', 'name', 'description', brandedDescription],
			['meta[property="og:title"]', 'property', 'og:title', brandedTitle],
			['meta[property="og:description"]', 'property', 'og:description', brandedDescription],
			['meta[name="twitter:title"]', 'name', 'twitter:title', brandedTitle],
			['meta[name="twitter:description"]', 'name', 'twitter:description', brandedDescription],
		];
		values.forEach(([selector, attribute, key, content]) => {
			let tag = document.querySelector<HTMLMetaElement>(selector);
			if (!tag) {
				tag = document.createElement('meta');
				tag.setAttribute(attribute, key);
				document.head.append(tag);
			}
			tag.content = content;
		});
	}, [title, description]);
	return null;
}
