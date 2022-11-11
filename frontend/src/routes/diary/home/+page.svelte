<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { BASE_API_URI } from '$lib/utils/constants.utils';
	import { session } from '$lib/store/session.store';
	import { handlePostRequestsWithPermissions } from '$lib/utils/requests.utils';
	import { goto } from '$app/navigation';
	import { loading } from '$lib/store/loading.store';
	import { flip } from 'svelte/animate';
	import type { CustomError } from '$lib/interfaces/error.interface';

	onMount(() => {
		const range = <HTMLInputElement>document.getElementById('range'),
			rangeV = <HTMLElement>document.getElementById('rangeV'),
			setValue = () => {
				const rangeValue = Number((range as HTMLInputElement).value);
				const rangeMinValue = Number((range as HTMLInputElement).min);
				const rangeMaxValue = Number((range as HTMLInputElement).max);
				const newValue = ((rangeValue - rangeMinValue) * 100) / (rangeMaxValue - rangeMinValue),
					newPosition = 10 - newValue * 0.2;
				rangeV.innerHTML = `<span>${range.value}</span>`;
				rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
			};
		document.addEventListener('DOMContentLoaded', setValue);
		range.addEventListener('input', setValue);
	});
	let painIntensity = 0.0,
		painDate: Date,
		errors: Array<CustomError>;

	const submitForm = async () => {
		const data = {
			pain_intensity: painIntensity,
			pain_date: painDate
		};
		loading.setLoading(true, 'Creating pain record, please wait...');
		const [res, err] = await handlePostRequestsWithPermissions(
			`${BASE_API_URI}/pain-record/`,
			data,
			'POST',
			$session.user?.tokens?.access
		);
		if (err.length > 0) {
			loading.setLoading(false, '');
			errors = err;
		} else {
			loading.setLoading(false, '');
			$session.painRecord = res;
			await goto(`/diary/add/questions/${$session.painRecord?.id}`);
		}
	};
</script>

<main id="main">
	<section
		id="appointment"
		class="appointment section-bg home"
		in:fly={{ y: 50, duration: 500, delay: 500 }}
		out:fly={{ duration: 500 }}
	>
		<form action="" method="post" class="form" on:submit|preventDefault={submitForm}>
			<div class="section-title">
				<h2>How is your pain right now?</h2>
				{#if errors}
					{#each errors as error (error.id)}
						<p
							class="text-center text-danger"
							transition:scale|local={{ start: 0.7 }}
							animate:flip={{ duration: 200 }}
						>
							{error.error}
						</p>
					{/each}
				{/if}

				<div class="input-group mb-3">
					<span class="input-group-text" id="basic-addon1">
						<i class="fa-solid fa-calendar-plus" />
					</span>
					<input
						type="date"
						class="form-control"
						aria-label="pain-date"
						bind:value={painDate}
						aria-describedby="basic-addon1"
					/>
				</div>
			</div>
			<div class="range-wrap">
				<div class="range-value" id="rangeV" />
				<input
					id="range"
					type="range"
					min="0.00"
					max="10.00"
					bind:value={painIntensity}
					step="0.01"
					class="slider"
				/>
			</div>
			<div class="mt-4 text-center">
				<button type="submit">&plus; Add pain record</button>
			</div>
		</form>
	</section>
	<section class="about">
		<div class="container">
			<div class="row">
				<div class="col-lg-6">
					<div class="member">
						<div class="icon-boxes d-flex flex-column align-items-stretch justify-content-center">
							<div class="icon-box">
								<div class="icon"><i class="fa-solid fa-fingerprint" /></div>
								<h4 class="title"><a href={null}>Lorem Ipsum</a></h4>
								<p class="description">
									Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
									occaecati cupiditate non provident
								</p>
							</div>
						</div>
					</div>
					<div class="member">
						<div class="icon-boxes d-flex flex-column align-items-stretch justify-content-center">
							<div class="icon-box">
								<div class="icon"><i class="fa-solid fa-fingerprint" /></div>
								<h4 class="title"><a href={null}>Lorem Ipsum</a></h4>
								<p class="description">
									Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
									occaecati cupiditate non provident
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
