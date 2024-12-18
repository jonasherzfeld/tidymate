<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<any> {
    children: Snippet;
    checked: boolean;
    onclick?: () => void;
  }
  let { children, checked = $bindable(), onclick, ...others }: Props = $props();
</script>

<li>
  <div class="flex h-full w-full justify-start p-2">
    <button class="flex h-full w-full flex-1 justify-start" {onclick}>
      <input
        type="checkbox"
        bind:checked
        class="checkbox checkbox-sm checkbox-primary"
        {...others} />
      <span class=" ml-3 text-start" {...others}>
        {@render children?.()}
      </span>
    </button>
  </div>
</li>
