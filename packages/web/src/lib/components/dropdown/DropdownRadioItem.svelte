<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    interface Props extends HTMLButtonAttributes {
        children: Snippet;
        name: string;
        radio_name: string;
        checked?: boolean;
        onchange?: (event) => void;
    }
    let { children, name, radio_name, checked, onchange }: Props = $props();
</script>

<li>
    <div class="form-control flex w-full h-fit justify-start items-center p-2">
        <label class="flex w-full h-fit justify-start items-center">
            <input
                type="radio"
                name={radio_name}
                {onchange}
                class="radio radio-sm radio-primary"
                value={name}
                {checked}
            />
            <span class="ml-3 h-fit text-start">
                {@render children?.()}
            </span>
        </label>
    </div>
</li>
