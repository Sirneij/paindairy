import { writable } from 'svelte/store';

export const notificationData = writable({ message: '', backgroundColor: '' });

export const redirectUrl = writable('');
