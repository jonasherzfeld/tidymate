<script lang="ts">
    import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
    import type { LoginSchema } from '$lib/utils/schemas';
    import IconTextInput from '$lib/components/IconTextInput.svelte';
    import { page } from '$app/stores';

    let { login_form }: { login_form: SuperValidated<Infer<LoginSchema>> } = $props();
    const { form, errors, enhance } = superForm(login_form, {
        onSubmit: async () => {
            is_loading = true;
        },
        onUpdate: async ({ form, result }) => {
            is_loading = false;
            server_errors = result.data.errors;
        }
    });
    let server_errors = $state();
    let is_loading = $state(false);
</script>

<form class="flex flex-col space-y-4" method="POST" action="?/login" use:enhance>
    {#if server_errors}
        <h1 class="mt-2 step-subtitle text-error">
            {server_errors}
        </h1>
    {/if}
    <input
        type="hidden"
        name="next"
        value={$page.url.searchParams.get('next')}
        aria-invalid={$errors.email ? 'true' : undefined}
    />
    <div>
        <IconTextInput bind:value={$form.email} type="text" name="email" placeholder="Email">
            <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
        </IconTextInput>
        {#if $errors.email}<span class="invalid text-error">{$errors.email}</span>{/if}
    </div>
    <div>
        <IconTextInput
            bind:value={$form.password}
            type="password"
            name="password"
            placeholder="Password"
        >
            <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
            />
        </IconTextInput>
        {#if $errors.password}<span class="invalid text-error">{$errors.password}</span>{/if}
    </div>
    <div>
        <button class="btn btn-neutral w-full" disabled={is_loading}>
            {#if !is_loading}
                Login
            {:else}
                <span class="loading loading-spinner loading-lg"></span>
            {/if}
        </button>
    </div>
</form>
