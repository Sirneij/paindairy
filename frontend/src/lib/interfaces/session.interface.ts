import type { PainRecord } from '$lib/interfaces/painrecord.interface';
import type { User } from '$lib/interfaces/user.interface';

export interface Session {
	user?: User;
	previousUrl?: string;
	loginUrl?: string;
	registerUrl?: string;
	painRecord?: PainRecord;
}
