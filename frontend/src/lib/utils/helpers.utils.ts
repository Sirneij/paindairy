import type { User } from '$lib/interfaces/user.interface';

export const isEmpty = (obj: User | null | undefined) => {
	if (obj === undefined || obj === null) {
		obj = {};
	}
	return Object.keys(obj).length === 0;
};

export const biggestValue = (elements: Array<HTMLElement>) => {
	const arrayOfWidths: Array<number> = [];
	elements.forEach((element) => {
		arrayOfWidths.push(element.getBoundingClientRect().width);
	});
	return Math.max(...arrayOfWidths);
};

export const setInputWidth = () => {
	const form = <HTMLFormElement>document.querySelector('form.form');
	const tabButtons = <Array<HTMLElement>>(
		(<unknown>document.querySelectorAll('button.nav-link[type="button"]'))
	);
	const inputElements = <Array<HTMLElement>>(
		(<unknown>document.querySelectorAll('input, select, checkbox, textarea'))
	);
	inputElements.forEach((inputElement) => {
		console.log(inputElement);
		console.log(form.getBoundingClientRect().width);

		inputElement.style.width = `calc(${form.getBoundingClientRect().width}px - ${biggestValue(
			tabButtons
		)}px)`;
		console.log(getComputedStyle(inputElement).width);
	});
};
