<script lang="ts">
  import TextInput from "$lib/components/TextInput.svelte";
  import {
    superForm,
    type SuperValidated,
    type Infer
  } from "sveltekit-superforms";
  import type { RegisterHouseSchema } from "$lib/utils/schemas";

  let {
    registerHouseForm
  }: { registerHouseForm: SuperValidated<Infer<RegisterHouseSchema>> } =
    $props();
  const { form, errors, enhance } = superForm(registerHouseForm, {
    onSubmit: async () => {
      isLoading = true;
    },
    onUpdate: async ({ form, result }) => {
      isLoading = false;
      serverErrors = result.data.errors;
    }
  });
  let isLoading: boolean = $state(false);
  let serverErrors: string = $state("");
</script>

<form
  class="m-2 mt-4 flex flex-col space-y-2"
  action="?/register_house"
  method="POST"
  use:enhance>
  {#if serverErrors}
    <h1 class="step-subtitle warning mt-2">
      {serverErrors}
    </h1>
  {/if}

  <div>
    <TextInput
      type="text"
      name="house_name"
      placeholder="Home name"
      bind:value={$form.house_name} />
    {#if $errors.house_name}<span class="invalid text-error"
        >{$errors.house_name}</span
      >{/if}
  </div>

  <div>
    <TextInput
      type="text"
      name="house_city"
      placeholder="City (optional)"
      bind:value={$form.house_city} />
    {#if $errors.house_city}<span class="invalid text-error"
        >{$errors.house_city}</span
      >{/if}
  </div>

  <div>
    <TextInput
      type="text"
      name="house_country"
      placeholder="Country (optional)"
      bind:value={$form.house_country} />
    {#if $errors.house_country}<span class="invalid text-error"
        >{$errors.house_country}</span
      >{/if}
  </div>

  <div class="btn-container">
    <button class="btn btn-neutral w-full" disabled={isLoading}>
      {#if !isLoading}
        Register
      {:else}
        <span class="loading loading-spinner loading-lg"></span>
      {/if}
    </button>
  </div>
</form>
