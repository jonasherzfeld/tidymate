<script>
    import 'tailwindcss/tailwind.css';
    import TextInput from './TextInput.svelte';

    export let type = 'text';
    export let name;
    export let placeholder = '';
    export let class_in = 'input input-bordered flex items-center gap-2';
    export let value = '';
    export let disabled = false;
</script>

<TextInput {type} {name} {class_in} {placeholder} {value} {disabled}>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4 opacity-70"
    >
        <slot />
    </svg>
</TextInput>
