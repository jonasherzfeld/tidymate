<script>
    import 'tailwindcss/tailwind.css';

    export let type = 'text';
    export let name;
    export let placeholder = '';
    export let class_in = 'grow';
    export let value = '';
    export let disabled = false;
</script>

<label class="input input-bordered flex items-center gap-2">
    <slot />
    <input {type} {name} class={class_in} {placeholder} {value} {disabled} />
</label>
