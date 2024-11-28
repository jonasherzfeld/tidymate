<script lang="ts">
    import LoginForm from '$lib/components/LoginForm.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="lg:text-center">
    <div>
        <h1 class="text-4xl">Login</h1>
    </div>
    <LoginForm loginForm={data.loginForm} />
    <p class="mt-2">Have no account? <a href="/auth/register">Register here</a>.</p>
</div>
