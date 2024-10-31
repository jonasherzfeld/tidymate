<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        type: string,
        name: string,
        placeholder: string,
        class_in: string,
        value: string,
        disabled: boolean,
        children: Snippet
    }
    let {
        type = 'text',
        name,
        placeholder = '',
        class_in = '',
        value = '',
        disabled = false,
        children
    }: Props = $props();
</script>

<label class={'input input-bordered flex items-center gap-1 ' + class_in}>
    {@render children?.()}
    <input {type} {name} class="text-right grow" {placeholder} {value} {disabled} />
</label>
