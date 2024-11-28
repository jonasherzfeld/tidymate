<script lang="ts">
    import RegisterHouseForm from '$lib/components/RegisterHouseForm.svelte';

    let { data } = $props();
</script>

<div>
    <div>
        <h1 class="text-4xl">Register House</h1>
    </div>
    <RegisterHouseForm registerHouseForm={data.register_house_form} />
</div>
