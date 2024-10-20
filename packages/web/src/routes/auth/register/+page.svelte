<script>
    import { create_group } from '$lib/utils/stores';

    function handleCreateGroup(input) {
        create_group.set(input);
    }
</script>

<div>
    <p class="text-center">Register a new home or join an existing one.</p>
</div>
<div>
    <div class="mt-4 mb-4 grid gap-4 sm:grid-cols-2">
        <a
            class="btn btn-neutral w-full"
            href="/auth/register/user"
            on:click={() => {
                handleCreateGroup(false);
            }}>Join a Home</a
        >
        <a
            class="btn btn-neutral w-full"
            href="/auth/register/user"
            on:click={() => {
                handleCreateGroup(true);
            }}>Register a new Home</a
        >
    </div>
    <p>
        Already registered? <a href="/auth/login">Login here</a>.
    </p>
</div>
