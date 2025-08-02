<script lang="ts">
  import TextInput from "$lib/components/TextInput.svelte";
  import {
    superForm,
    type SuperValidated,
    type Infer
  } from "sveltekit-superforms";
  import type { RegisterSchema } from "$lib/utils/schemas";

  let {
    registerForm
  }: { registerForm: SuperValidated<Infer<RegisterSchema>> } = $props();

  const { form, errors, enhance } = superForm(registerForm, {
    onSubmit: async () => {
      isLoading = true;
    },
    onUpdate: async ({ result }) => {
      isLoading = false;
      serverErrors = result.data.errors;
    }
  });
  let serverErrors: string = $state("");
  let isLoading: boolean = $state(false);
</script>

<form
  class="m-2 mt-4 flex flex-col space-y-2"
  action="?/register"
  method="POST"
  use:enhance>
  <div class="form- m-3 flex">
    <input
      name="is_join_home"
      type="checkbox"
      class="toggle toggle-primary cursor-pointer"
      bind:checked={$form.is_join_home} />
    <span class="label-text ml-3">Join an existing home</span>
  </div>
  {#if serverErrors}
    <h1 class="step-subtitle text-error mt-2">
      {serverErrors}
    </h1>
  {/if}

  <div>
    <TextInput
      type="text"
      name="email"
      placeholder="Email"
      classIn={$errors.email ? "input-error" : ""}
      bind:value={$form.email} />
    {#if $errors.email}<span
        class="invalid text-error ml-2 flex w-full text-start text-sm"
        >{$errors.email}</span
      >{/if}
  </div>

  <div>
    <TextInput
      type="text"
      name="first_name"
      placeholder="First name"
      classIn={$errors.first_name ? "input-error" : ""}
      bind:value={$form.first_name} />
    {#if $errors.first_name}
      <span class="invalid text-error ml-2 flex w-full text-start text-sm"
        >{$errors.first_name}</span>
    {/if}
  </div>
  <div>
    <TextInput
      type="text"
      name="last_name"
      placeholder="Last name"
      classIn={$errors.last_name ? "input-error" : ""}
      bind:value={$form.last_name} />
    {#if $errors.last_name}<span
        class="invalid text-error ml-2 flex w-full text-start text-sm"
        >{$errors.last_name}</span
      >{/if}
  </div>

  <div>
    <TextInput
      type="password"
      name="password"
      placeholder="Password"
      classIn={$errors.password ? "input-error" : ""}
      bind:value={$form.password} />
    {#if $errors.password}<span
        class="invalid text-error ml-2 flex w-full text-start text-sm"
        >{$errors.password}</span
      >{/if}
  </div>

  <div>
    <TextInput
      type="password"
      name="confirm_password"
      placeholder="Confirm Password"
      classIn={$errors.confirm_password ? "input-error" : ""}
      bind:value={$form.confirm_password} />
    {#if $errors.confirm_password}<span
        class="invalid text-error ml-2 flex w-full text-start text-sm"
        >{$errors.confirm_password}</span
      >{/if}
  </div>

  {#if $form.is_join_home}
    <div>
      <TextInput
        type="text"
        name="join_id"
        placeholder="Join ID"
        classIn={`input input-bordered flex items-center gap-2 ${$errors.join_id ? "input-error" : "input-primary"}`}
        bind:value={$form.join_id} />
      {#if $errors.join_id}<span
          class="invalid text-error ml-2 flex w-full text-start text-sm"
          >{$errors.join_id}</span
        >{/if}
    </div>
  {/if}

  <div class="btn-container">
    <button class="btn btn-neutral w-full" disabled={isLoading}>
      {#if !isLoading}
        {!$form.is_join_home ? "Continue" : "Register"}
      {:else}
        <span class="loading loading-spinner loading-lg"></span>
      {/if}
    </button>
  </div>
</form>
