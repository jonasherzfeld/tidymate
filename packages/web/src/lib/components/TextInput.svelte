<script>
    import 'tailwindcss/tailwind.css';

    export let type;
    export let name;
    export let placeholder;
    export let class_in;
</script>

<label class="input input-bordered flex items-center gap-2">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4 opacity-70"
    >
        <slot />
    </svg>
    <input {type} {name} class={class_in} {placeholder} />
</label>
