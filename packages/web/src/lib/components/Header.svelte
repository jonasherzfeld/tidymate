<script>
	import 'tailwindcss/tailwind.css';

	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Developer from '$lib/img/hero-image.png';
	import Avatar from '$lib/img/teamavatar.png';
	import Unknown from '$lib/img/Unknown_person.jpg';

	//const Avatar = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';
</script>

<div class="navbar bg-base-100 text-shade-500 border-solid border-b border-shape-500">
	<div class="flex-none">
		<button class="btn btn-square btn-ghost">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-5 w-5 stroke-current"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				></path>
			</svg>
		</button>
	</div>
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">Tidymate</a>
	</div>
	<div class="flex-none gap-2">
		<ul class="menu menu-horizontal px-1">
			<li><a>About</a></li>
			<li><a>Documention</a></li>
		</ul>
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					{#if !$page.data.user}
						<img alt="User" src={Unknown} />
					{:else}
						<img alt="User" src={$page.data.user.thumbnail ? $page.data.user.thumbnail : Avatar} />
					{/if}
				</div>
			</div>
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
			>
				{#if !$page.data.user}
					<li><a href="/auth/login">Login</a></li>
					<li><a href="/auth/register">Register</a></li>
				{:else}
					<li>
						<a href="/auth/about/{$page.data.user.id}" class="justify-between"> Profile </a>
					</li>

					<form
						action="/auth/logout"
						method="POST"
						use:enhance={async () => {
							return async ({ result }) => {
								await applyAction(result);
							};
						}}
					>
						<!-- <li><a href="/auth/logout">Logout</a></li> -->
						<li><button type="submit">Logout</button></li>
					</form>
				{/if}
			</ul>
		</div>
	</div>
</div>
