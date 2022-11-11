<script lang="ts">
	import { loading } from '$lib/store/loading.store';
	import { onMount } from 'svelte';

	let isPageLoaded = false;

	onMount(() => {
		isPageLoaded = true;
	});

	$: if ($loading.status === 'NAVIGATING') {
		setTimeout(() => {
			if ($loading.status === 'NAVIGATING') {
				$loading.status = 'LOADING';
			}
		}, 100);
	}
</script>

{#if $loading.status === 'LOADING'}
	<div class="loader-container">
		<div class="loader" />
		{#if $loading.message}
			<div class="text-container">
				<p>{$loading.message}</p>
			</div>
		{/if}
	</div>
{/if}

{#if !isPageLoaded}
	<div class="loader-start">
		<div class="loader" />
		<div class="text-container">
			<p>Welcome to PainDairy...</p>
		</div>
	</div>
{/if}

<style>
	/* Source: https://www.freecodecamp.org/news/how-to-create-a-css-only-loader/ */
	:root {
		--size: 80px;
	}
	.loader-container {
		position: fixed;
		top: 7.5rem;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #b9c6d2;
		background: linear-gradient(180deg, #d0dde9 3%, #edf0f8 41.35%);
		z-index: 99999;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.loader-start {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #b9c6d2;
		background: linear-gradient(180deg, #d0dde9 3%, #edf0f8 41.35%);
		z-index: 99999;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.loader {
		--b: 20px; /* border thickness */
		--n: 15; /* number of dashes*/
		--g: 7deg; /* gap  between dashes*/
		--c: #3291e6; /* the color */

		width: var(--size); /* size */
		aspect-ratio: 1;
		border-radius: 50%;
		padding: 1px; /* get rid of bad outlines */
		background: conic-gradient(#0000, var(--c)) content-box;
		-webkit-mask: /* we use +/-1deg between colors to avoid jagged edges */ repeating-conic-gradient(
				#0000 0deg,
				#000 1deg calc(360deg / var(--n) - var(--g) - 1deg),
				#0000 calc(360deg / var(--n) - var(--g)) calc(360deg / var(--n))
			),
			radial-gradient(farthest-side, #0000 calc(98% - var(--b)), #000 calc(100% - var(--b)));
		mask: repeating-conic-gradient(
				#0000 0deg,
				#000 1deg calc(360deg / var(--n) - var(--g) - 1deg),
				#0000 calc(360deg / var(--n) - var(--g)) calc(360deg / var(--n))
			),
			radial-gradient(farthest-side, #0000 calc(98% - var(--b)), #000 calc(100% - var(--b)));
		-webkit-mask-composite: destination-in;
		mask-composite: intersect;
		animation: load 1s infinite steps(var(--n));
	}
	.text-container {
		padding-top: 1rem;
		display: flex;
		justify-content: center;
	}

	.text-container p {
		line-height: 1.5;
		font-weight: 700;
		overflow: hidden; /* Ensures the content is not revealed until the animation */
		border-right: 0.15em solid #3291e6; /* The typwriter cursor */
		white-space: nowrap; /* Keeps the content on a single line */
		margin: 0 auto; /* Gives that scrolling effect as the typing happens */
		animation: typing 3.5s steps(30, end), blink-caret 0.5s step-end infinite;
	}
	@keyframes load {
		to {
			transform: rotate(1turn);
		}
	}
	/* The typing effect */
	@keyframes typing {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	/* The typewriter cursor effect */
	@keyframes blink-caret {
		from,
		to {
			border-color: transparent;
		}
		50% {
			border-color: #3291e6;
		}
	}
</style>
