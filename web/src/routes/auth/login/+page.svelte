<script lang="ts">
  import LoginForm from "$lib/components/LoginForm.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-2 text-left">
  <h1 class="text-base-content text-3xl font-semibold tracking-tight">Welcome back</h1>
  <p class="text-muted text-sm">Sign in to your Tidymate account.</p>
</div>

<div class="mt-8">
  <LoginForm loginForm={data.loginForm} />
</div>

<p class="text-muted mt-6 text-center text-sm">
  Don't have an account?
  <a href="/auth/register" class="text-primary font-medium hover:underline">Register</a>
</p>
