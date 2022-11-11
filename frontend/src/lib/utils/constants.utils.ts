export const BASE_API_URI = import.meta.env.DEV
	? import.meta.env.VITE_BASE_API_URI_DEV
	: import.meta.env.VITE_BASE_API_URI_PROD;

export const BASE_URI = BASE_API_URI.split('/api')[0];

export const danceEmoji = '💃';
export const angryEmoji = '😠';
export const sadEmoji = '😔';
export const happyEmoji = '😊';
export const thinkingEmoji = '🤔';
export const eyesRoll = '🙄';

export const redColor = '#dc3545';
export const greenColor = '#198754';
export const yellowColor = '#ffc107';
export const cyanColor = '#0dcaf0';
