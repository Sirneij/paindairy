import type { PainRecord } from '$lib/interfaces/painrecord.interface';

export interface Token {
	refresh: string;
	access: string;
}
export interface User {
	id?: string;
	email?: string;
	username?: string;
	password?: string;
	tokens?: Token;
	bio?: string;
	full_name?: string;
	birth_date?: string;
	thumbnail?: string;
	is_staff?: boolean;
	is_doctor?: boolean;
	created_at?: string;
	pain_records?: Array<PainRecord>;
}

export interface UserRequest {
	user?: User;
}

export interface ContactUS {
	email: string;
	full_name: string;
	content: string;
}
