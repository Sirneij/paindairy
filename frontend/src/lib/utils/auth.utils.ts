import { isEmpty } from '$lib/utils/helpers.utils';
import { BASE_API_URI, redColor, sadEmoji } from '$lib/utils/constants.utils';
import type { Session } from '$lib/interfaces/session.interface';
import { logOutUser } from '$lib/utils/requests.utils';
import { notificationData } from '$lib/store/notification.store';
import { session } from '$lib/store/session.store';

export const refreshToken = async ($session: Session) => {
	if (!isEmpty($session.user)) {
		const res = await fetch(`${BASE_API_URI}/token/refresh/`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				refresh: $session.user?.tokens ? $session.user?.tokens?.refresh : ''
			})
		});
		if (res.ok) {
			const accessRefresh = await res.json();
			session.setTokens(accessRefresh);
		} else {
			notificationData.set({
				message: `Your access token has become invalid and we couldnot renew it, therefore, we decided to log you out. Kindly login back. We are sorry ${sadEmoji}.`,
				backgroundColor: `${redColor}`
			});
			logOutUser($session);
		}
	}
};
