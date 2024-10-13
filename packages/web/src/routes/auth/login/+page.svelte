<script>
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

<div class="container">
	<form class="content" method="POST" action="?/login" use:enhance={handleLogin}>
		<h1 class="step-title">Login User</h1>
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
		<div class="input-box">
			<span class="label">Email:</span>
			<input class="input" type="email" name="email" placeholder="Email address" />
		</div>
		<div class="input-box">
			<span class="label">Password:</span>
			<input class="input" type="password" name="password" placeholder="Password" />
			<p style="margin-left: 1rem;">Forgot password?</p>
			<!-- this should be a link at some point -->
		</div>
		<div class="btn-container">
			<button class="button-dark">Login</button>
			<p>Have no account? <a href="/auth/register">Register here</a>.</p>
		</div>
	</form>
</div>
