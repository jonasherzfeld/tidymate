<script lang="ts">
  import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
  import type { RegisterSchema } from "$lib/utils/schemas";
  import { Button, FloatingInput } from "$lib/components/ui";
  import { EmailIcon, PasswordIcon, UserIcon, HouseIcon } from "$lib/utils/icons";

  let { registerForm }: { registerForm: SuperValidated<Infer<RegisterSchema>> } = $props();

  const { form, errors, enhance } = superForm(registerForm, {
    onSubmit: async () => {
      isLoading = true;
    },
    onUpdate: async ({ result }) => {
      isLoading = false;
      serverErrors = (result.data as any)?.errors ?? "";
    }
  });
  let serverErrors: string = $state("");
  let isLoading: boolean = $state(false);
</script>

<form class="flex flex-col gap-5" action="?/register" method="POST" use:enhance>
  {#if serverErrors}
    <div class="bg-error/10 text-error border-error/20 rounded-field border px-3 py-2 text-sm">
      {serverErrors}
    </div>
  {/if}

  <!-- Join toggle -->
  <label
    class="border-neutral bg-base-200/50 hover:bg-base-200 flex cursor-pointer items-center justify-between rounded-field border p-3 transition-colors">
    <div class="flex items-center gap-3">
      <HouseIcon class="text-primary h-4 w-4" />
      <div>
        <div class="text-sm font-medium">Join an existing home</div>
        <div class="text-muted text-xs">Already have a join ID from a household admin?</div>
      </div>
    </div>
    <input
      name="is_join_home"
      type="checkbox"
      class="toggle toggle-primary"
      bind:checked={$form.is_join_home} />
  </label>

  <div class="flex flex-col gap-3">
    <div>
      <FloatingInput
        bind:value={$form.email}
        type="email"
        name="email"
        label="Email"
        autocomplete="email"
        error={!!$errors.email}>
        {#snippet leading()}
          <EmailIcon class="h-4 w-4" />
        {/snippet}
      </FloatingInput>
      {#if $errors.email}
        <span class="text-error mt-1 ml-1 block text-xs">{$errors.email}</span>
      {/if}
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <FloatingInput
          bind:value={$form.first_name}
          name="first_name"
          label="First name"
          autocomplete="given-name"
          error={!!$errors.first_name}>
          {#snippet leading()}
            <UserIcon class="h-4 w-4" />
          {/snippet}
        </FloatingInput>
        {#if $errors.first_name}
          <span class="text-error mt-1 ml-1 block text-xs">{$errors.first_name}</span>
        {/if}
      </div>
      <div>
        <FloatingInput
          bind:value={$form.last_name}
          name="last_name"
          label="Last name"
          autocomplete="family-name"
          error={!!$errors.last_name} />
        {#if $errors.last_name}
          <span class="text-error mt-1 ml-1 block text-xs">{$errors.last_name}</span>
        {/if}
      </div>
    </div>

    <div>
      <FloatingInput
        bind:value={$form.password}
        type="password"
        name="password"
        label="Password"
        autocomplete="new-password"
        error={!!$errors.password}>
        {#snippet leading()}
          <PasswordIcon class="h-4 w-4" />
        {/snippet}
      </FloatingInput>
      {#if $errors.password}
        <span class="text-error mt-1 ml-1 block text-xs">{$errors.password}</span>
      {/if}
    </div>

    <div>
      <FloatingInput
        bind:value={$form.confirm_password}
        type="password"
        name="confirm_password"
        label="Confirm password"
        autocomplete="new-password"
        error={!!$errors.confirm_password}>
        {#snippet leading()}
          <PasswordIcon class="h-4 w-4" />
        {/snippet}
      </FloatingInput>
      {#if $errors.confirm_password}
        <span class="text-error mt-1 ml-1 block text-xs">{$errors.confirm_password}</span>
      {/if}
    </div>

    {#if $form.is_join_home}
      <div>
        <FloatingInput
          bind:value={$form.join_id}
          name="join_id"
          label="Join ID"
          error={!!$errors.join_id}>
          {#snippet leading()}
            <HouseIcon class="h-4 w-4" />
          {/snippet}
        </FloatingInput>
        {#if $errors.join_id}
          <span class="text-error mt-1 ml-1 block text-xs">{$errors.join_id}</span>
        {/if}
      </div>
    {/if}
  </div>

  <Button variant="primary" size="lg" block loading={isLoading} type="submit">
    {$form.is_join_home ? "Register" : "Continue"}
  </Button>
</form>
