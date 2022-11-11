import type { Session } from '$lib/interfaces/session.interface';
import { get, writable, type Writable } from 'svelte/store';

const newSession = () => {
	const { subscribe, update, set }: Writable<Session> = writable({
		user: {},
		previousUrl: '',
		loginUrl: '/accounts/login',
		registerUrl: '/accounts/register'
	});

	function setTokens(accessToken: string) {
		update(() => {
			const $session = get(session);
			const user = $session.user;
			if (user?.tokens) {
				user.tokens.access = accessToken;
			}
			return {
				user: user,
				previousUrl: $session.previousUrl,
				loginUrl: $session.loginUrl,
				registerUrl: $session.registerUrl
			};
		});
	}
	function setPreviousUrl(url: string) {
		update(() => {
			const $session = get(session);
			return {
				user: $session.user,
				previousUrl: url,
				loginUrl: $session.loginUrl,
				registerUrl: $session.registerUrl
			};
		});
	}

	function resetUser() {
		const $session = get(session);
		update(() => {
			return {
				user: {},
				previousUrl: $session.previousUrl,
				loginUrl: $session.loginUrl,
				registerUrl: $session.registerUrl
			};
		});
	}

	return { subscribe, update, set, resetUser, setTokens, setPreviousUrl };
};

export const session = newSession();
