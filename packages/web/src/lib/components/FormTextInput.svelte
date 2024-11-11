<script lang="ts" context="module">
    type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
    import {
        formFieldProxy,
        superForm,
        type SuperForm,
        type FormPathLeaves
    } from 'sveltekit-superforms';
    import EditIcon from 'virtual:icons/mdi/file-edit-outline';
    import SubmitIcon from 'virtual:icons/mdi/file-send-outline';

    type Props = {
        superform: SuperForm<T>;
        field: FormPathLeaves<T>;
        edit_value: boolean;
        creating_value: boolean;
        label: string;
        disabled?: boolean;
    };
    let {
        superform,
        field,
        edit_value = $bindable(),
        creating_value = $bindable(),
        label = '',
        disabled = false
    }: Props = $props();

    const form = superForm(superform);
    const { value, errors, constraints } = formFieldProxy(form, field);

    let change_mode_bg = $derived(edit_value ? 'bg-base-300' : 'bg-base-200');
</script>

<div class="flex join w-full">
    <div class={`flex justify-between w-full border border-slate-500 ${change_mode_bg}`}>
        <span class="label label-text text-left ml-2 w-24 join-item"><b>{label}</b></span>
        {#if edit_value}
            <input
                type="text"
                name={field}
                size="1"
                class={`label label-text grow text-right join-item mr-3 ${change_mode_bg}`}
                bind:value={$value}
            />
        {:else}
            <span class={`label label-text grow justify-end join-item mr-3 ${change_mode_bg}`}
                >{$value}</span
            >
        {/if}
        {#if edit_value}
            <button type="submit" class="btn join-item btn-primary" disabled={creating_value}>
                {#if !creating_value}
                    <SubmitIcon style="font-size:1.2em" />
                {:else}
                    <span class="loading loading-spinner loading-sm"></span>
                {/if}
            </button>
        {:else}
            <button
                type="button"
                class="btn join-item bg-base-300"
                {disabled}
                onclick={() => {
                    edit_value = true;
                }}
            >
                <EditIcon style="font-size:1.2em" />
            </button>
        {/if}
    </div>
</div>
