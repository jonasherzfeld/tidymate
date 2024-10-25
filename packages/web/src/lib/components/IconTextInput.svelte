<script>
    import 'tailwindcss/tailwind.css';
    import TextInput from './TextInput.svelte';

    /**
     * @typedef {Object} Props
     * @property {string} [type]
     * @property {any} name
     * @property {string} [placeholder]
     * @property {string} [class_in]
     * @property {string} [value]
     * @property {boolean} [disabled]
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let {
        type = 'text',
        name,
        placeholder = '',
        class_in = 'input input-bordered flex items-center gap-2',
        value = '',
        disabled = false,
        children
    } = $props();
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
