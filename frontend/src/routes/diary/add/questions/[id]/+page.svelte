<script lang="ts">
	import Severity from '$lib/components/TabContents/Severity.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
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
		setValue();
		range.addEventListener('input', setValue);
	});
	export let data: PageData;
	
</script>

<main id="main">
	<section
		id="appointment"
		class="appointment section-bg questions"
		in:fly={{ y: 50, duration: 500, delay: 500 }}
		out:fly={{ duration: 500 }}
	>
		<form action="" method="post" class="form">
			<div class="section-title">
				<h2>Questions relating to the pain.</h2>
			</div>
			<div class="d-flex align-items-start">
				<div
					class="nav flex-column nav-pills me-3"
					id="v-pills-tab"
					role="tablist"
					aria-orientation="vertical"
				>
					<button
						class="nav-link active d-flex"
						id="v-pills-pain-severity-tab"
						data-bs-toggle="pill"
						data-bs-target="#v-pills-pain-severity"
						type="button"
						role="tab"
						aria-controls="v-pills-pain-severity"
						aria-selected="true"
					>
						<span class="d-flex flex-column">
							Severity
							<small class="text-muted">What is the intensity of the pain?</small>
						</span>
					</button>
					<button
						class="nav-link d-flex"
						id="v-pills-pain-feeling-tab"
						data-bs-toggle="pill"
						data-bs-target="#v-pills-pain-feeling"
						type="button"
						role="tab"
						aria-controls="v-pills-pain-feeling"
						aria-selected="false"
					>
						<span class="d-flex flex-column">
							What besides pain are you feeling?
							<small class="text-muted">Feeling</small>
						</span>
					</button>
					<button
						class="nav-link d-flex"
						id="v-pills-pain-description-tab"
						data-bs-toggle="pill"
						data-bs-target="#v-pills-pain-description"
						type="button"
						role="tab"
						aria-controls="v-pills-pain-description"
						aria-selected="false"
					>
						<span class="d-flex flex-column">
							What words best describe your pain?
							<small class="text-muted text-sm">Description</small>
						</span>
					</button>
					<button
						class="nav-link d-flex"
						id="v-pills-pain-worse-reason-tab"
						data-bs-toggle="pill"
						data-bs-target="#v-pills-pain-worse-reason"
						type="button"
						role="tab"
						aria-controls="v-pills-pain-worse-reason"
						aria-selected="false"
					>
						<span class="d-flex flex-column">
							What made your pain worse?
							<small class="text-muted">Reason</small>
						</span>
					</button>
					<button
						class="nav-link d-flex"
						id="v-pills-pain-activity-tab"
						data-bs-toggle="pill"
						data-bs-target="#v-pills-pain-activity"
						type="button"
						role="tab"
						aria-controls="v-pills-pain-activity"
						aria-selected="false"
					>
						<span class="d-flex flex-column">
							What were you doing during your pain?
							<small class="text-muted">Activity</small>
						</span>
					</button>
				</div>
				<div class="tab-content" id="v-pills-tabContent">
					<div
						class="tab-pane fade show active"
						id="v-pills-pain-severity"
						role="tabpanel"
						aria-labelledby="v-pills-pain-severity-tab"
					>
						<Severity painRecord={data.painRecord} />
					</div>
					<div
						class="tab-pane fade show active"
						id="v-pills-pain-feeling"
						role="tabpanel"
						aria-labelledby="v-pills-pain-feeling-tab"
					>
						...
					</div>
					<div
						class="tab-pane fade"
						id="v-pills-pain-description"
						role="tabpanel"
						aria-labelledby="v-pills-pain-description-tab"
					>
						...
					</div>
					<div
						class="tab-pane fade"
						id="v-pills-pain-worse-reason"
						role="tabpanel"
						aria-labelledby="v-pills-pain-worse-reason-tab"
					>
						...
					</div>
					<div
						class="tab-pane fade"
						id="v-pills-pain-activity"
						role="tabpanel"
						aria-labelledby="v-pills-pain-activity-tab"
					>
						...
					</div>
				</div>
			</div>
		</form>
	</section>
</main>
