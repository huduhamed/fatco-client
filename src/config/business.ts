export const businessConfig = {
	name: 'FATCO GH',
	tagline: 'Your shirt Your club Your game',
	description: 'Football jersey store serving fans in Accra and across Ghana.',
	email: 'danfodio1991@gmail.com',
	phone: '+233 24 698 1912 / 55 291 1078',
	whatsapp: '23324 698 1912',
	address: 'Physical store address',
	city: 'Accra, Ghana',
	openingHours: ['Monday–Saturday: 9:00–18:00', 'Sunday: Closed'],
	currency: 'GHS',
	social: {
		facebook: 'https://www.facebook.com/share/1D2ouJH3bu/?mibextid=wwXIfr',
	},
} as const;

export const shippingConfig = {
	accra: { label: 'Accra delivery', fee: 30 },
	ghana: { label: 'Delivery outside Accra', fee: 55 },
	pickup: { label: 'Store pickup', fee: 0 },
	freeShippingThreshold: 1000,
} as const;

export const whatsappUrl = (message = 'Hello Fatco GH, I would like to ask about a jersey.') =>
	`https://wa.me/${businessConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
