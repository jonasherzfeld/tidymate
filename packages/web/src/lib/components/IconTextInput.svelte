<script lang="ts">
    import TextInput from './TextInput.svelte';
    import type { Snippet } from 'svelte';

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

<TextInput {type} {name} {class_in} {placeholder} {value} {disabled}>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4 opacity-70"
    >
        {@render children?.()}
    </svg>
</TextInput>
