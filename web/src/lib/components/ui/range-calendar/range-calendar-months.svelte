<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils.ts";

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div
  class={cn(
    "mt-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4",
    className
  )}
  {...$$restProps}>
  <slot />
</div>
