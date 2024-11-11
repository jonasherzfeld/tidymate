<script lang="ts">
    import TextInput from '$lib/components/TextInput.svelte';
    import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
    import type { RegisterSchema } from '$lib/utils/schemas';

    let { register_form }: { register_form: SuperValidated<Infer<RegisterSchema>> } = $props();

    const { form, errors, enhance } = superForm(register_form, {
        onSubmit: async () => {
            is_loading = true;
        },
        onUpdate: async ({ form, result }) => {
            is_loading = false;
            server_errors = result.data.errors;
            form.data.is_join_home = true;
        }
    });
    let server_errors = $state();
    let is_loading = $state(false);
</script>

<form class="flex flex-col space-y-2 mt-4 m-2" action="?/register" method="POST" use:enhance>
    <div class="flex form- m-3">
        <input
            name="is_join_home"
            type="checkbox"
            class="toggle toggle-primary cursor-pointer"
            bind:checked={$form.is_join_home}
        />
        <span class="label-text ml-3">Join an existing home</span>
    </div>
    {#if server_errors}
        <h1 class="mt-2 step-subtitle text-error">
            {server_errors}
        </h1>
    {/if}

    <div>
        <TextInput type="text" name="email" placeholder="Email" bind:value={$form.email}>
            <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
        </TextInput>
        {#if $errors.email}<span class="invalid text-error">{$errors.email}</span>{/if}
    </div>

    <div>
        <TextInput
            type="text"
            name="first_name"
            placeholder="First name"
            bind:value={$form.first_name}
        />
        {#if $errors.first_name}
            <span class="invalid text-error">{$errors.first_name}</span>
        {/if}
    </div>
    <div>
        <TextInput
            type="text"
            name="last_name"
            placeholder="Last name"
            bind:value={$form.last_name}
        />
        {#if $errors.last_name}<span class="invalid text-error">{$errors.last_name}</span>{/if}
    </div>

    <div>
        <TextInput
            type="password"
            name="password"
            placeholder="Password"
            bind:value={$form.password}
        >
            <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
            />
        </TextInput>
        {#if $errors.password}<span class="invalid text-error">{$errors.password}</span>{/if}
    </div>

    <div>
        <TextInput
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            bind:value={$form.confirm_password}
        >
            <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
            />
        </TextInput>
        {#if $errors.confirm_password}<span class="invalid text-error"
                >{$errors.confirm_password}</span
            >{/if}
    </div>

    {#if $form.is_join_home}
        <div>
            <TextInput
                type="text"
                name="join_id"
                placeholder="Join ID"
                class_in="input input-bordered input-primary flex items-center gap-2"
                bind:value={$form.join_id}
            />
            {#if $errors.join_id}<span class="invalid text-error">{$errors.join_id}</span>{/if}
        </div>
    {/if}

    <div class="btn-container">
        <button class="btn btn-neutral w-full" disabled={is_loading}>
            {#if !is_loading}
                {!$form.is_join_home ? 'Continue' : 'Register'}
            {:else}
                <span class="loading loading-spinner loading-lg"></span>
            {/if}
        </button>
    </div>
</form>
