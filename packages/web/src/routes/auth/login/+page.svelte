<script lang="ts">
    import 'tailwindcss/tailwind.css';

    import IconTextInput from '$lib/components/IconTextInput.svelte';
    import { applyAction, enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { receive, send } from '$lib/utils/helpers.js';

    let { form } = $props();
    let is_loading = $state(false);

    const handleLogin = async () => {
        is_loading = true;

        return async ({ result }) => {
            is_loading = false;
            await applyAction(result);
        };
    };
</script>

<div class="lg:text-center">
    <form class="flex flex-col space-y-4" method="POST" action="?/login" use:enhance={handleLogin}>
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
        <IconTextInput value="" type="text" name="email" placeholder="Email">
            <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
        </IconTextInput>
        <IconTextInput value="" type="password" name="password" placeholder="Password">
            <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
            />
        </IconTextInput>
        <div>
            <button class="btn btn-neutral btn-wide w-full" disabled={is_loading}>
                {#if !is_loading}
                    Login
                {:else}
                    <span class="loading loading-spinner loading-lg"></span>
                {/if}
            </button>
            <p>Have no account? <a href="/auth/register">Register here</a>.</p>
        </div>
    </form>
</div>
