<script>
    import 'tailwindcss/tailwind.css';

    export let type = 'text';
    export let name;
    export let placeholder = '';
    export let class_in = 'input input-bordered flex items-center gap-2';
    export let value = '';
    export let disabled = false;
</script>

<label class={class_in}>
    <slot />
    <input {type} {name} class="grow" {placeholder} {value} {disabled} />
</label>
