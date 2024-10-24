<script>
    import 'tailwindcss/tailwind.css';

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

<label class={class_in}>
    {@render children?.()}
    <input {type} {name} class="grow" {placeholder} {value} {disabled} />
</label>
