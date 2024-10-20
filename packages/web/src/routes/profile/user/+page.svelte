<script>
    import TextInput from '$lib/components/TextInput.svelte';

    export let data;
</script>

<div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">Hi, {data.user.first_name}!</h1>
            <p class="py-6">This is your profile page. Here you can see your details.</p>
            <TextInput name="email" bind:value={data.user.email} disabled={true}
                ><b>Email</b></TextInput
            >
            <TextInput name="first_name" bind:value={data.user.first_name} disabled={true}
                ><b>First name</b>
            </TextInput>
            <TextInput name="last_name" bind:value={data.user.last_name} disabled={true}
                ><b>Last name</b>
            </TextInput>
            <TextInput name="joined_on" bind:value={data.user.joined_on} disabled={true}
                ><b>Joined On</b>
            </TextInput>
        </div>
    </div>
</div>
