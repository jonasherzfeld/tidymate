<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    interface Props extends HTMLButtonAttributes {
        children: Snippet;
        name?: string;
        radioName: string;
        checked?: boolean;
        onchange?: (event) => void;
    }
    let { children, name, radioName, checked, onchange }: Props = $props();
</script>

<li>
    <div class="form-control flex w-full h-fit justify-start items-center p-0">
        <label class="flex w-full h-fit justify-start items-center p-2">
            <input
                type="radio"
                name={radioName}
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
