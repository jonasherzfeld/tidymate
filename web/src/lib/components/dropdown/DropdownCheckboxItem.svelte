<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    checked: boolean;
    onclick?: () => void;
  }
  let { children, checked = $bindable(), onclick }: Props = $props();
</script>

<li>
  <div class="flex h-full w-full justify-start p-2">
    <button class="flex h-full w-full flex-1 justify-start" {onclick}>
      <input
        type="checkbox"
        bind:checked
        class="checkbox-primary checkbox checkbox-sm" />
      <span class=" ml-3 text-start">
        {@render children?.()}
      </span>
    </button>
  </div>
</li>
