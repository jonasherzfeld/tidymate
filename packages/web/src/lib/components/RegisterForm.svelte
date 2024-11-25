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
        }
    });
    let server_errors: string = $state('');
    let is_loading: boolean = $state(false);
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
        <TextInput
            type="text"
            name="email"
            placeholder="Email"
            class_in={$errors.email ? 'input-error' : ''}
            bind:value={$form.email}
        />
        {#if $errors.email}<span class="flex w-full ml-2 invalid text-start text-error text-sm"
                >{$errors.email}</span
            >{/if}
    </div>

    <div>
        <TextInput
            type="text"
            name="first_name"
            placeholder="First name"
            class_in={$errors.first_name ? 'input-error' : ''}
            bind:value={$form.first_name}
        />
        {#if $errors.first_name}
            <span class="flex w-full ml-2 invalid text-start text-error text-sm"
                >{$errors.first_name}</span
            >
        {/if}
    </div>
    <div>
        <TextInput
            type="text"
            name="last_name"
            placeholder="Last name"
            class_in={$errors.last_name ? 'input-error' : ''}
            bind:value={$form.last_name}
        />
        {#if $errors.last_name}<span class="flex w-full ml-2 invalid text-start text-error text-sm"
                >{$errors.last_name}</span
            >{/if}
    </div>

    <div>
        <TextInput
            type="password"
            name="password"
            placeholder="Password"
            class_in={$errors.password ? 'input-error' : ''}
            bind:value={$form.password}
        />
        {#if $errors.password}<span class="flex w-full ml-2 invalid text-start text-error text-sm"
                >{$errors.password}</span
            >{/if}
    </div>

    <div>
        <TextInput
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            class_in={$errors.confirm_password ? 'input-error' : ''}
            bind:value={$form.confirm_password}
        />
        {#if $errors.confirm_password}<span
                class="flex w-full ml-2 invalid text-start text-error text-sm"
                >{$errors.confirm_password}</span
            >{/if}
    </div>

    {#if $form.is_join_home}
        <div>
            <TextInput
                type="text"
                name="join_id"
                placeholder="Join ID"
                class_in={`input input-bordered flex items-center gap-2 ${$errors.join_id ? 'input-error' : 'input-primary'}`}
                bind:value={$form.join_id}
            />
            {#if $errors.join_id}<span
                    class="flex w-full ml-2 invalid text-start text-error text-sm"
                    >{$errors.join_id}</span
                >{/if}
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
