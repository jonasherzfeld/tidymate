<script>
	import Header from '$lib/components/Header.svelte';
	import Logo from '$lib/img/tidymate_logo_white.png';
	import { page } from '$app/stores';

	$: nav_links = !$page.data.user
		? []
		: [
				{ title: 'Home', href: '/home' },
				{ title: 'Todo', href: '/home/todo' },
				{ title: 'Chores', href: '/home/chores' }
		  ];
</script>

<div class="drawer">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div
			class="navbar bg-base-300 w-full bg-base-100 text-shade-500 border-solid border-b border-shape-500"
		>
			{#if nav_links.length !== 0}
				<div class="flex-none lg:hidden">
					<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block h-6 w-6 stroke-current"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</label>
				</div>
			{/if}
			<Header {nav_links} />
		</div>
		<slot />
	</div>

	<div class="drawer-side">
		<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay" />
		<ul class="menu bg-base-200 min-h-full w-80 p-4">
			<!-- Sidebar content here -->
			<a href="/" class="btn btn-ghost text-xl">
				<img alt="User" src={Logo} width="30px" />Tidymate</a
			>
			{#if nav_links.length !== 0}
				{#each nav_links as link}
					<li><a href={link.href}>{link.title}</a></li>
				{/each}
			{/if}
		</ul>
	</div>
</div>
