<script lang="ts">
	import { navigating } from '$app/stores';
	import '$lib/assets/css/bootstrap.min.css';
	import '$lib/assets/css/style.css';
	import '$lib/assets/js/bootstrap.bundle.min.js';
	import Footer from '$lib/components/Footer/Footer.svelte';
	import Header from '$lib/components/Header/Header.svelte';
	import Loader from '$lib/components/Loader/Loader.svelte';
	import { loading } from '$lib/store/loading.store';
	import { notificationData } from '$lib/store/notification.store';
	import { session } from '$lib/store/session.store';
	import { browser } from '$app/environment';
	import { refreshToken } from '$lib/utils/auth.utils';
	import { afterUpdate } from 'svelte';
	import { fly } from 'svelte/transition';
	import { isEmpty } from '$lib/utils/helpers.utils';

	$: loading.setNavigate(!!$navigating);
	$: loading.setLoading(!!$navigating, 'Loading, please wait...');

	afterUpdate(async () => {
		const notifyEl = document.getElementById('notification');

		if (notifyEl && $notificationData.message !== '') {
			setTimeout(() => {
				notifyEl.classList.add('disappear');
				$notificationData = { message: '', backgroundColor: '' };
			}, 3000);
		}
	});
	let clear: string | number | ReturnType<typeof setInterval> | undefined;
	$: {
		if (browser && !isEmpty($session.user)) {
			clearInterval(clear);
			clear = setInterval(refreshToken.bind(null, $session), 499990);
		}
	}
</script>

<Header />
{#if $notificationData.message && $notificationData.backgroundColor}
	<p
		class="notification"
		id="notification"
		style="background: {$notificationData.backgroundColor}"
		in:fly={{ x: 200, duration: 500, delay: 500 }}
		out:fly={{ x: 200, duration: 500 }}
	>
		{$notificationData.message}
	</p>
{/if}
<Loader />
<slot />

<Footer />
