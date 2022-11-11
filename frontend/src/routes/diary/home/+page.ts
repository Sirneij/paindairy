import { notificationData } from '$lib/store/notification.store';
import { session } from '$lib/store/session.store';
import { angryEmoji, redColor } from '$lib/utils/constants.utils';
import { isEmpty } from '$lib/utils/helpers.utils';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = () => {
	const $session = get(session);
	if (isEmpty($session.user)) {
		notificationData.set({
			message: `You are not logged in ${angryEmoji}...`,
			backgroundColor: `${redColor}`
		});
		let loginUrl = '/';
		if ($session.loginUrl) {
			loginUrl = $session.loginUrl;
		}
		throw redirect(307, loginUrl);
	}
};
