<script lang="ts" context="module">
    type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
    import {
        formFieldProxy,
        superForm,
        type SuperValidated,
        type FormPathLeaves
    } from 'sveltekit-superforms';
    import EditIcon from 'virtual:icons/mdi/file-edit-outline';
    import SubmitIcon from 'virtual:icons/mdi/file-send-outline';

    let {
        superform,
        field,
        editValue = $bindable(),
        creatingValue = $bindable(),
        label = '',
        disabled = false
    }: {
        superform: SuperValidated<T>;
        field: FormPathLeaves<T>;
        editValue: boolean;
        creatingValue: boolean;
        label: string;
        disabled?: boolean;
    } = $props();

    const form = superForm(superform);
    const { value, errors, constraints } = formFieldProxy(form, field);

    let changeModeBg = $derived(editValue ? 'bg-neutral text-base-300' : 'bg-base-100');
</script>

<div class="flex join w-full">
    <div
        class={`input input-bordered flex pl-0 pr-0 justify-between items-center w-full ${changeModeBg}`}
    >
        <span class={`label label-text text-left m-2 w-24 h-full join-item ${changeModeBg}`}
            ><b>{label}</b></span
        >
        {#if editValue}
            <input
                type="text"
                name={field}
                size="1"
                class={`label label-text grow text-right join-item mr-3 ${changeModeBg}`}
                bind:value={$value}
            />
        {:else}
            <span class={`label label-text grow justify-end join-item mr-3 ${changeModeBg}`}
                >{$value}</span
            >
        {/if}
        {#if editValue}
            <button
                type="submit"
                class="btn -mr-px h-full join-item btn-secondary input-bordered disabled:bg-base-300"
                disabled={creatingValue}
            >
                {#if !creatingValue}
                    <SubmitIcon style="font-size:1.2em" />
                {:else}
                    <span class="loading loading-spinner loading-sm"></span>
                {/if}
            </button>
        {:else}
            <button
                type="button"
                class="btn -mr-px h-full join-item bg-primary input-bordered"
                {disabled}
                onclick={() => {
                    editValue = true;
                }}
            >
                <EditIcon style="font-size:1.2em" />
            </button>
        {/if}
    </div>
</div>
