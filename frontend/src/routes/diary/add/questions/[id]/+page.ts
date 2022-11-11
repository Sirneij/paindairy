import type { PainRecord } from '$lib/interfaces/painrecord.interface';
import { loading } from '$lib/store/loading.store';
import { notificationData } from '$lib/store/notification.store';
import { session } from '$lib/store/session.store';
import { angryEmoji, BASE_API_URI, redColor } from '$lib/utils/constants.utils';
import { isEmpty } from '$lib/utils/helpers.utils';
import type { PageLoad } from '.svelte-kit/types/src/routes/diary/add/questions/$types';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
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
	} else if (!isEmpty($session.user) && isEmpty($session.painRecord)) {
		notificationData.set({
			message: `You currently do not have any pain record ${angryEmoji}. Please create one...`,
			backgroundColor: `${redColor}`
		});
		throw redirect(307, '/diary/add/pain-intensity');
	} else {
		loading.setLoading(true, 'Fetching pain record, please wait...');
		const response = await fetch(`${BASE_API_URI}/pain-record/${params.id}/`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${$session.user?.tokens?.access}`
			}
		});
		loading.setLoading(false, '');
		const painRecord: PainRecord = await response.json();
		return {
			painRecord: painRecord
		};
	}
};
