<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { Check } from "lucide-svelte";
  import { cn } from "$lib/utils";

  type Props = Omit<HTMLInputAttributes, "size"> & {
    class?: string;
    size?: "sm" | "md" | "lg";
  };

  let { class: className = "", size = "md", checked = $bindable(false), ...rest }: Props = $props();

  const sizeMap = {
    sm: "h-4 w-4 [&_svg]:h-3 [&_svg]:w-3",
    md: "h-5 w-5 [&_svg]:h-3.5 [&_svg]:w-3.5",
    lg: "h-6 w-6 [&_svg]:h-4 [&_svg]:w-4"
  } as const;
</script>

<label
  class={cn(
    "relative inline-flex shrink-0 cursor-pointer items-center justify-center",
    "rounded-full border transition-all duration-150",
    "border-base-content/25 bg-base-100",
    "hover:border-primary/60",
    "has-[:checked]:border-primary has-[:checked]:bg-primary",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
    "focus-within:shadow-[var(--shadow-focus)]",
    sizeMap[size],
    className
  )}>
  <input type="checkbox" class="peer sr-only" bind:checked {...rest} />
  <span
    class="text-primary-content pointer-events-none scale-0 opacity-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] peer-checked:scale-100 peer-checked:opacity-100">
    <Check stroke-width={3} />
  </span>
</label>
