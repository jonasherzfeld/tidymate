<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.ts";

  type $$Props = CalendarPrimitive.GridBodyProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.GridBody class={cn(className)} {...$$restProps}>
  <slot />
</CalendarPrimitive.GridBody>
