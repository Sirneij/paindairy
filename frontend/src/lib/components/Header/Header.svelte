<script lang="ts">
	import { page } from '$app/stores';
	import { session } from '$lib/store/session.store';
	import { BASE_URI } from '$lib/utils/constants.utils';
	import { isEmpty } from '$lib/utils/helpers.utils';
	import { logOutUser } from '$lib/utils/requests.utils';
	import { onMount } from 'svelte';
	onMount(() => {
		const select = (el: string, all = false) => {
			el = el.trim();
			if (all) {
				return [...document.querySelectorAll(el)];
			} else {
				return document.querySelector(el);
			}
		};

		const on = (
			type: string,
			el: string,
			listener: EventListenerOrEventListenerObject,
			all = false
		) => {
			let selectEl = select(el, all);
			if (selectEl) {
				if (all) {
					(selectEl as unknown as Array<HTMLElement>).forEach((e) =>
						e.addEventListener(type, listener)
					);
				} else {
					(selectEl as HTMLElement).addEventListener(type, listener);
				}
			}
		};

		/**
		 * Mobile nav toggle
		 */
		on('click', '.mobile-nav-toggle', function (this: any, _e) {
			(select('#navbar') as HTMLElement).classList.toggle('navbar-mobile');
			this.classList.toggle('fa-bars');
			this.classList.toggle('fa-xmark');
		});
	});
	let userThumbNailUrl = '';
	$: if (!isEmpty($session.user)) {
		const userThumbNail = $session.user?.thumbnail;
		userThumbNailUrl = `${BASE_URI}${userThumbNail}`;
	}
</script>

<header id="header" class="fixed-top">
	<div class="container d-flex align-items-center">
		<h1 class="logo me-auto"><a href="/">PainDairy</a></h1>
		<!-- Uncomment below if you prefer to use an image logo -->
		<!-- <a href="index.html" class="logo me-auto"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->

		<nav id="navbar" class="navbar order-last order-lg-0">
			<ul>
				{#if isEmpty($session.user)}
					<li>
						<a
							class="nav-link"
							href="/accounts/login"
							class:active={$page.url.pathname === '/accounts/login'}>Login</a
						>
					</li>
					<li>
						<a
							class="nav-link"
							href="/accounts/register"
							class:active={$page.url.pathname === '/accounts/register'}>Register</a
						>
					</li>
				{:else}
					<li class="nav-item dropdown">
						<a
							class="nav-link dropdown-toggle d-flex align-items-center"
							href={null}
							id="navbarDropdownMenuLink"
							role="button"
							data-mdb-toggle="dropdown"
							aria-expanded="false"
						>
							<img
								src={userThumbNailUrl}
								class="rounded-circle"
								height="22"
								alt="Portrait of a Woman"
								loading="lazy"
							/>
						</a>
						<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
							<li>
								<a class="dropdown-item" href='/diary/home'>Home</a>
							</li>
							<li>
								<a class="dropdown-item" href={null}>Reports</a>
							</li>
							<li><h6 class="dropdown-header">Results</h6></li>
							<li><h6 class="dropdown-header">Misc</h6></li>
							<li>
								<a class="dropdown-item" href={null}>Settings</a>
							</li>
							<li>
								<button class="dropdown-item" type="button" on:click={() => logOutUser($session.user?.tokens)}>
									Logout
								</button>
							</li>
						</ul>
					</li>
				{/if}
				<!-- <li><a class="nav-link" href="#doctors">Doctors</a></li>
				<li><a class="nav-link" href="#contact">Contact</a></li> -->
			</ul>
			<i class="fa-solid fa-bars mobile-nav-toggle" />
		</nav>
	</div>
</header>
