<script lang="ts">
	import { goto } from '$app/navigation';
	import type { CustomError } from '$lib/interfaces/error.interface';
	import type { UserRequest } from '$lib/interfaces/user.interface';
	import { notificationData } from '$lib/store/notification.store';
	import { session } from '$lib/store/session.store';
	import { BASE_API_URI, greenColor, happyEmoji } from '$lib/utils/constants.utils';
	import { post } from '$lib/utils/requests.utils';
	import { scale, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { loading } from '$lib/store/loading.store';

	let email = '',
		password = '',
		errors: Array<CustomError> = [];

	const handleLogin = async () => {
		loading.setLoading(true, 'Logging in, please wait...');
		const [res, err] = await post(`${BASE_API_URI}/login/`, {
			user: {
				email: email,
				password: password
			}
		});
		if (err.length > 0) {
			loading.setLoading(false, '');
			errors = err;
		} else {
			loading.setLoading(false, '');

			const userResponse: UserRequest = res;

			if (userResponse.user) {
				$session.user = userResponse.user;
				$notificationData = {
					message: `Login successful ${happyEmoji}...`,
					backgroundColor: `${greenColor}`
				};
				if ($session.user.pain_records && $session.user.pain_records?.length >= 1) {
					await goto('/diary/home');
				} else {
					await goto('/diary/add/pain-intensity');
				}
			}
		}
	};
</script>

<main id="main">
	<section
		id="appointment"
		class="appointment section-bg"
		in:fly={{ y: 50, duration: 500, delay: 500 }}
		out:fly={{ duration: 500 }}
	>
		<form action="" method="post" class="form" on:submit|preventDefault={handleLogin}>
			<div class="section-title">
				<h2>Login into your account</h2>
				<div class="social-links text-center text-md-right pt-3 pt-md-0">
					<p>You can, alternatively, use:</p>
					<a href={null} class="twitter"><i class="fa-brands fa-twitter" /></a>
					<a href={null} class="facebook"><i class="fa-brands fa-facebook" /></a>
					<a href={null} class="instagram"><i class="fa-brands fa-instagram" /></a>
					<a href={null} class="google-plus"><i class="fa-brands fa-skype" /></a>
					<a href={null} class="linkedin"><i class="fa-brands fa-linkedin" /></a>
				</div>
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
			<div class="mb-3">
				<label for="email" class="form-label">Email address</label>
				<input
					type="email"
					bind:value={email}
					class="form-control"
					id="email"
					aria-describedby="email-help"
				/>
				<div id="email-help" class="form-text">We'll never share your email with anyone else.</div>
			</div>
			<div class="mb-3">
				<label for="password" class="form-label">Password</label>
				<input type="password" class="form-control" id="password" bind:value={password} />
			</div>
			<div class="mb-3 form-check">
				<p>No account yet? <a href="/accounts/register">Create one.</a></p>
			</div>
			<div class="text-center"><button type="submit">Login</button></div>
		</form>
	</section>
</main>
