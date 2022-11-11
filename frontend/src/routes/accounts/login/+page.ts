import { notificationData } from '$lib/store/notification.store';
import { session } from '$lib/store/session.store';
import { angryEmoji, redColor } from '$lib/utils/constants.utils';
import { isEmpty } from '$lib/utils/helpers.utils';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	if (!isEmpty(get(session).user)) {
		notificationData.set({
			message: `You can't access this page since you are already logged in ${angryEmoji}.`,
			backgroundColor: `${redColor}`
		});
		throw redirect(307, '/');
	}
};
