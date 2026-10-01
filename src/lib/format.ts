// internal imports
import { businessConfig } from '../config/business';

// format money
export const formatMoney = (amount: number, currency: string = businessConfig.currency) =>
	new Intl.NumberFormat('en-GH', { style: 'currency', currency, minimumFractionDigits: 2 }).format(
		amount,
	);
