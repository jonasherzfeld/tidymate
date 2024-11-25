<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        type = 'text',
        name,
        placeholder = '',
        class_in = '',
        value = $bindable(),
        disabled = false,
        children
    }: {
        type?: string;
        name: string;
        placeholder?: string;
        class_in?: string;
        value?: string;
        disabled?: boolean;
        children?: Snippet;
    } = $props();
</script>

<label class={'input input-bordered flex items-center gap-1 ' + class_in}>
    {@render children?.()}
    <input {type} {name} class="text-right grow" {placeholder} {value} {disabled} />
</label>
