<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";

  type Props = HTMLAttributes<HTMLDivElement> & {
    class?: string;
  };

  let { class: className = "", ...rest }: Props = $props();
</script>

<div
  aria-hidden="true"
  class={cn("bg-base-200 animate-pulse rounded-field", className)}
  {...rest}>
</div>
