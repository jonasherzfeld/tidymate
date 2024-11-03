<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        is_change_mode: boolean,
        desc_text: string,
        label_text: string,
        name: string,
        children?: Snippet
    }
    let {
        is_change_mode = false,
        desc_text,
        label_text = $bindable(),
        name = '',
        children
    } : Props = $props();


    let change_mode_bg = $derived(is_change_mode ? 'bg-base-100' : 'bg-base-300');
</script>


<div class="flex join w-full">
    <div class={`flex justify-between w-full border border-slate-500 ${change_mode_bg}`}>
        <span class="label label-text text-left ml-2 join-item"><b>{desc_text}</b></span>
        {#if is_change_mode}
            <input type='text' {name} class={`label label-text grow text-right  join-item mr-3 ${change_mode_bg}`}  bind:value={label_text}/>
        {:else}
            <span class={`label label-text grow justify-end join-item mr-3 ${change_mode_bg}`}>{label_text}</span>
        {/if}
        {@render children?.()}
    </div>
</div>