<script lang="ts">
  import RegisterForm from "$lib/components/RegisterForm.svelte";

  let { data } = $props();
</script>

<div class="flex flex-col gap-2 text-left">
  <h1 class="text-base-content text-3xl font-semibold tracking-tight">Create your account</h1>
  <p class="text-muted text-sm">Get started by creating a household or joining one.</p>
</div>

<div class="mt-8">
  <RegisterForm registerForm={data.register_form} />
</div>

<p class="text-muted mt-6 text-center text-sm">
  Already have an account?
  <a href="/auth/login" class="text-primary font-medium hover:underline">Sign in</a>
</p>
