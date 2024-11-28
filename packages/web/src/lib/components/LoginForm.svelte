<script lang="ts">
    import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
    import type { LoginSchema } from '$lib/utils/schemas';
    import TextInput from '$lib/components/TextInput.svelte';
    import EmailIcon from 'virtual:icons/mdi/email';
    import PasswordIcon from 'virtual:icons/mdi/password';
    import { page } from '$app/stores';

    let { loginForm }: { loginForm: SuperValidated<Infer<LoginSchema>> } = $props();
    const { form, errors, enhance } = superForm(loginForm, {
        onSubmit: async () => {
            isLoading = true;
        },
        onUpdate: async ({ form, result }) => {
            isLoading = false;
            serverErrors = result.data.errors;
        }
    });
    let serverErrors: string = $state('');
    let isLoading: boolean = $state(false);
</script>

<form class="flex flex-col space-y-4" method="POST" action="?/login" use:enhance>
    {#if serverErrors}
        <h1 class="mt-2 step-subtitle text-error">
            {serverErrors}
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
            classIn={$errors.email ? 'input-error' : ''}
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
            classIn={$errors.password ? 'input-error' : ''}
        >
            <PasswordIcon class="h-4 w-4 opacity-60" />
        </TextInput>
        {#if $errors.password}<span class="flex w-full ml-2 invalid text-start text-error text-sm"
                >{$errors.password}</span
            >{/if}
    </div>
    <div>
        <button class="btn btn-neutral w-full" disabled={isLoading}>
            {#if !isLoading}
                Login
            {:else}
                <span class="loading loading-spinner loading-lg"></span>
            {/if}
        </button>
    </div>
</form>
