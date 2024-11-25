<script lang="ts">
    import TextInput from '$lib/components/TextInput.svelte';
    import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
    import type { RegisterHouseSchema } from '$lib/utils/schemas';

    let {
        register_house_form
    }: { register_house_form: SuperValidated<Infer<RegisterHouseSchema>> } = $props();
    const { form, errors, enhance } = superForm(register_house_form, {
        onSubmit: async () => {
            is_loading = true;
        },
        onUpdate: async ({ form, result }) => {
            is_loading = false;
            server_errors = result.data.errors;
        }
    });
    let is_loading: boolean = $state(false);
    let server_errors: string = $state('');
</script>

<form class="flex flex-col space-y-2 mt-4 m-2" action="?/register_house" method="POST" use:enhance>
    {#if server_errors}
        <h1 class="mt-2 step-subtitle warning">
            {server_errors}
        </h1>
    {/if}

    <div>
        <TextInput
            type="text"
            name="house_name"
            placeholder="Home name"
            bind:value={$form.house_name}
        />
        {#if $errors.house_name}<span class="invalid text-error">{$errors.house_name}</span>{/if}
    </div>

    <div>
        <TextInput
            type="text"
            name="house_city"
            placeholder="City (optional)"
            bind:value={$form.house_city}
        />
        {#if $errors.house_city}<span class="invalid text-error">{$errors.house_city}</span>{/if}
    </div>

    <div>
        <TextInput
            type="text"
            name="house_country"
            placeholder="Country (optional)"
            bind:value={$form.house_country}
        />
        {#if $errors.house_country}<span class="invalid text-error">{$errors.house_country}</span
            >{/if}
    </div>

    <div class="btn-container">
        <button class="btn btn-neutral w-full" disabled={is_loading}>
            {#if !is_loading}
                Register
            {:else}
                <span class="loading loading-spinner loading-lg"></span>
            {/if}
        </button>
    </div>
</form>
