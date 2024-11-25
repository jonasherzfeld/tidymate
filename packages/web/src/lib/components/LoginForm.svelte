<script lang="ts">
    import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
    import type { LoginSchema } from '$lib/utils/schemas';
    import TextInput from '$lib/components/TextInput.svelte';
    import EmailIcon from 'virtual:icons/mdi/email';
    import PasswordIcon from 'virtual:icons/mdi/password';
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
    let server_errors: string = $state('');
    let is_loading: boolean = $state(false);
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
        <TextInput
            bind:value={$form.email}
            type="text"
            name="email"
            placeholder="Email"
            class_in={$errors.email ? 'input-error' : ''}
        >
            <EmailIcon class="h-4 w-4 opacity-60" />
        </TextInput>
        {#if $errors.email}<span class="flex w-full ml-2 invalid text-start text-error text-sm"
                >{$errors.email}</span
            >{/if}
    </div>
    <div>
        <TextInput
            bind:value={$form.password}
            type="password"
            name="password"
            placeholder="Password"
            class_in={$errors.password ? 'input-error' : ''}
        >
            <PasswordIcon class="h-4 w-4 opacity-60" />
        </TextInput>
        {#if $errors.password}<span class="flex w-full ml-2 invalid text-start text-error text-sm"
                >{$errors.password}</span
            >{/if}
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
