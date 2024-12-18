<script lang="ts">
  import RegisterForm from "$lib/components/RegisterForm.svelte";

  let { data } = $props();
</script>

<div>
  <div>
    <h1 class="text-4xl">Register</h1>
  </div>
  <RegisterForm registerForm={data.register_form} />
  <p>
    Already registered? <a href="/auth/login">Login here</a>.
  </p>
</div>
