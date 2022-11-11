export interface PainQuestions {
	question: string;
	answer: string;
}

export interface PainRecord {
	id?: string;
	user?: string;
	pain_intensity?: number;
	pain_questions?: PainQuestions;
	pain_date?: Date;
	created_datetime?: Date;
	updated_datetime?: Date;
}
