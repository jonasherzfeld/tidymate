<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.ts";

  type $$Props = RangeCalendarPrimitive.GridHeadProps;

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.GridHead class={cn(className)} {...$$restProps}>
  <slot />
</RangeCalendarPrimitive.GridHead>
