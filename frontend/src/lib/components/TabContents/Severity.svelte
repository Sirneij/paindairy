<script lang="ts">
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';
	import type { PainRecord } from '$lib/interfaces/painrecord.interface';
	import { loading } from '$lib/store/loading.store';
	import { session } from '$lib/store/session.store';
	import { BASE_API_URI } from '$lib/utils/constants.utils';
	import { handlePostRequestsWithPermissions } from '$lib/utils/requests.utils';
	import type { CustomError } from '$lib/interfaces/error.interface';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';

	export let painRecord: PainRecord;
	let painIntensity = Number(painRecord.pain_intensity),
		painDate = painRecord.pain_date,
		errors: Array<CustomError>,
		showNext: (arg0: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => any;

	const handleSubmit = async () => {
		const data = {
			pain_intensity: painIntensity,
			pain_date: painDate
		};
		loading.setLoading(true, 'Creating pain record, please wait...');
		const [res, err] = await handlePostRequestsWithPermissions(
			`${BASE_API_URI}/pain-record/${$session.painRecord?.id}/`,
			data,
			'PATCH',
			$session.user?.tokens?.access
		);
		if (err.length > 0) {
			loading.setLoading(false, '');
			errors = err;
		} else {
			loading.setLoading(false, '');
			$session.painRecord = res;
		}
	};
	onMount(() => {
		showNext = (event: Event) => {
			const target = event.target as HTMLButtonElement;
			bootstrap.Tab.getOrCreateInstance(
				target.parentElement?.parentElement?.parentElement?.nextElementSibling
			).show();
		};
	});
</script>

<form action="" method="post" on:submit|preventDefault={handleSubmit}>
	<div class="section-title d-flex">
		<div class="row">
			<div class="col-6"><h4>How is your pain at 08:30am?</h4></div>
			<div class="col-6">
				<input
					type="date"
					class="form-control"
					aria-label="pain-date"
					aria-describedby="basic-addon1"
					bind:value={painDate}
				/>
			</div>
			<div class="col-12">
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
			</div>
		</div>
	</div>
	<div class="range-wrap">
		<div class="range-value" id="rangeV" />
		<input
			id="range"
			type="range"
			min="0.00"
			max="10.00"
			step="0.01"
			class="slider"
			bind:value={painIntensity}
		/>
	</div>
	<div class="mt-4 ">
		<button type="submit" class="btn btn-primary">Save and close</button>
	</div>
</form>
<div class="mt-4 ">
	<button type="button" class="btn btn-success me-auto" on:click={(e) => showNext(e)}>
		Next section
	</button>
</div>
