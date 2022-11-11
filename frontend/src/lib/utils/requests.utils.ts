import { goto } from '$app/navigation';
import type { CustomError } from '$lib/interfaces/error.interface';
import type { PainRecord } from '$lib/interfaces/painrecord.interface';
import type { Session } from '$lib/interfaces/session.interface';
import type { ContactUS, UserRequest } from '$lib/interfaces/user.interface';
import { notificationData } from '$lib/store/notification.store';
import { session } from '$lib/store/session.store';
import {
	BASE_API_URI,
	greenColor,
	happyEmoji,
	redColor,
	sadEmoji
} from '$lib/utils/constants.utils';

/**
 * An `async` function for making `POST` requests.
 * @param {string}  url - The URL of the backend API a request is sent to.
 * @param {UserRequest | ContactUS} body - The request's body
 * @returns {Promise<[object, Array<CustomError>]>} Returns a Promise.
 **/
export const post = async (
	url: string,
	body: UserRequest | ContactUS
): Promise<[object, Array<CustomError>]> => {
	try {
		const headers = { 'Content-Type': '' };
		if (!(body instanceof FormData)) {
			headers['Content-Type'] = 'application/json';
			const res = await fetch(url, {
				method: 'POST',
				mode: 'cors',
				body: JSON.stringify(body),
				headers: headers
			});
			if (!res.ok) {
				const response = await res.json();
				if (response.user) {
					if (response.user.error.length > 0) {
						const errors: Array<CustomError> = [];
						let counter = 0;
						for (const p in response.user.error) {
							errors.push({ error: response.user.error[p], id: counter++ });
						}

						return [{}, errors];
					}
				} else if (response.errors) {
					const errors: Array<CustomError> = [];
					let counter = 0;
					for (const p in response.errors) {
						errors.push({ error: response.errors[p], id: counter++ });
					}
					return [{}, errors];
				}
			}
			return [await res.json(), []];
		}
		return [{}, []];
	} catch (error) {
		console.error(`Error outside: ${error}`);
		const err = `${error}`;
		const errors: Array<CustomError> = [
			{ error: 'An unknown error occurred.', id: 0 },
			{ error: err, id: 1 }
		];
		return [{}, errors];
	}
};

/**
 * An `async` function for logging out users.
 * @param {string}  $session - A session object containing user's access and refresh tokens.
 * @returns {Promise<void>} Returns a Promise
 **/
export const logOutUser = async ($session: Session): Promise<void> => {
	if ($session.user?.tokens) {
		const jres = await fetch(`${BASE_API_URI}/logout/`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${$session.user.tokens.access}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				refresh: `${$session.user.tokens.refresh}`
			})
		});
		if (!jres.ok) {
			const data = await jres.json();

			notificationData.set({
				message: `${data.detail} ${sadEmoji}...Kindly refresh the page...`,
				backgroundColor: `${redColor}`
			});
		}
		notificationData.set({
			message: `Logout successful ${happyEmoji}...`,
			backgroundColor: `${greenColor}`
		});
		session.resetUser();
		await goto(`${$session.loginUrl}`);
	}
};

/**
 * An `async` function for logging out users.
 * @param {string}  targetUrl - The API URL to send data to or query data from.
 * @param {FormData | BodyInit | PainRecord}  body - Data to be sent to the API.
 * @param {string}  method - HTTP method or verb to be used.
 * @param {string | undefined}  accessToken - Querying user's accesstoken.
 * @returns {Promise<[Response | string, Response | string]>} Returns a Promise which has `Response` | `string` for both happy and unhappy paths.
 **/
export const handlePostRequestsWithPermissions = async (
	targetUrl: string,
	body: FormData | BodyInit | PainRecord,
	method: string,
	accessToken: string | undefined
): Promise<[object, Array<CustomError>]> => {
	const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}` };
	if (!(body instanceof FormData)) {
		headers['Content-Type'] = 'application/json';
		body = JSON.stringify(body);
	}
	try {
		const jres = await fetch(targetUrl, {
			method: method,
			mode: 'cors',
			headers: headers,
			body: body
		});

		if (jres.ok) {
			const res = await jres.json();
			return [res, []];
		} else {
			const data = await jres.json();
			let counter = 0;
			const errors: Array<CustomError> = [];
			if ('messages' in data) {
				for (const key in data.messages) {
					if (key === 'message') {
						errors.push({ error: data.messages[key], id: counter++ });
					}
				}
			} else if (data.messages.length <= 1) {
				errors.push({ error: `Error: ${data.detail}`, id: counter });
			}
			return [{}, errors];
		}
	} catch (error) {
		const errors: Array<CustomError> = [];
		errors.push({ error: `OutsideError:: ${error}`, id: 0 });
		return [{}, errors];
	}
};
