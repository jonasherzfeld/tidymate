<script>
    import TextInput from '$lib/components/TextInput.svelte';
    import JoinIdCreator from '$lib/components/JoinIdCreator.svelte';

    export let data;
</script>

<div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">{data.house.name}</h1>
            <p class="py-6">This is the settings page for your house!</p>
            <TextInput name="name" bind:value={data.house.name} disabled={true}
                ><b>Name</b></TextInput
            >
            <TextInput name="first_name" bind:value={data.house.country} disabled={true}
                ><b>Country</b>
            </TextInput>
            <TextInput name="last_name" bind:value={data.house.city} disabled={true}
                ><b>City</b>
            </TextInput>
            <TextInput name="joined_on" bind:value={data.house.created_on} disabled={true}
                ><b>Created On</b>
            </TextInput>

            <JoinIdCreator />
        </div>
    </div>
</div>
