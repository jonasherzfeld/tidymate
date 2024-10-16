<script>
	import 'tailwindcss/tailwind.css';

	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { receive, send } from '$lib/utils/helpers';

	/** @type {import('./$types').ActionData} */
	export let form;

	/** @type {import('./$types').SubmitFunction} */
	const handleLogin = async () => {
		return async ({ result }) => {
			await applyAction(result);
		};
	};
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<form
				class="flex flex-col space-y-4"
				method="POST"
				action="?/login"
				use:enhance={handleLogin}
			>
				<h1 class="text-title">Login User</h1>
				{#if form?.errors}
					{#each form?.errors as error (error.id)}
						<h4
							class="step-subtitle warning"
							in:receive={{ key: error.id }}
							out:send={{ key: error.id }}
						>
							{error.error}
						</h4>
					{/each}
				{/if}

				<input type="hidden" name="next" value={$page.url.searchParams.get('next')} />
				<label class="input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4 opacity-70"
					>
						<path
							d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
						/>
						<path
							d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
						/>
					</svg>
					<input type="text" name="email" class="grow" placeholder="Email" />
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4 opacity-70"
					>
						<path
							fill-rule="evenodd"
							d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
							clip-rule="evenodd"
						/>
					</svg>
					<input type="password" name="password" class="grow" placeholder="Password" />
				</label>
				<div>
					<button class="btn btn-neutral btn-wide">Login</button>
					<p>Have no account? <a href="/auth/register">Register here</a>.</p>
				</div>
			</form>
		</div>
	</div>
</div>
