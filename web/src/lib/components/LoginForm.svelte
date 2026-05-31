<script lang="ts">
  import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
  import type { LoginSchema } from "$lib/utils/schemas";
  import { Button, FloatingInput } from "$lib/components/ui";
  import { EmailIcon, PasswordIcon } from "$lib/utils/icons";
  import { page } from "$app/stores";

  let { loginForm }: { loginForm: SuperValidated<Infer<LoginSchema>> } = $props();
  const { form, errors, enhance } = superForm(loginForm, {
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

<form class="flex flex-col gap-5" method="POST" action="?/login" use:enhance>
  <input type="hidden" name="next" value={$page.url.searchParams.get("next")} />

  {#if serverErrors}
    <div class="bg-error/10 text-error border-error/20 rounded-field border px-3 py-2 text-sm">
      {serverErrors}
    </div>
  {/if}

  <div class="flex flex-col gap-3">
    <div>
      <FloatingInput
        bind:value={$form.email}
        type="email"
        name="email"
        label="Email"
        autocomplete="username"
        error={!!$errors.email}>
        {#snippet leading()}
          <EmailIcon class="h-4 w-4" />
        {/snippet}
      </FloatingInput>
      {#if $errors.email}
        <span class="text-error mt-1 ml-1 block text-xs">{$errors.email}</span>
      {/if}
    </div>

    <div>
      <FloatingInput
        bind:value={$form.password}
        type="password"
        name="password"
        label="Password"
        autocomplete="current-password"
        error={!!$errors.password}>
        {#snippet leading()}
          <PasswordIcon class="h-4 w-4" />
        {/snippet}
      </FloatingInput>
      {#if $errors.password}
        <span class="text-error mt-1 ml-1 block text-xs">{$errors.password}</span>
      {/if}
    </div>
  </div>

  <Button variant="primary" size="lg" block loading={isLoading} type="submit">
    Sign in
  </Button>
</form>
