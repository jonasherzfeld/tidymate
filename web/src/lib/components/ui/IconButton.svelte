<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants";

  export const iconButtonVariants = tv({
    base: [
      "inline-flex items-center justify-center shrink-0",
      "rounded-field transition-[transform,box-shadow,background-color,color,border-color] duration-150",
      "outline-none focus-visible:shadow-[var(--shadow-focus)]",
      "active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
    ],
    variants: {
      variant: {
        ghost: "bg-transparent text-base-content hover:bg-base-200",
        soft: "bg-base-200 text-base-content hover:bg-base-300",
        primary: "bg-primary text-primary-content hover:bg-primary/90",
        outline:
          "bg-transparent text-base-content border border-neutral hover:bg-base-200"
      },
      size: {
        xs: "h-7 w-7 [&_svg]:h-3.5 [&_svg]:w-3.5",
        sm: "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
        md: "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
        lg: "h-12 w-12 [&_svg]:h-6 [&_svg]:w-6"
      }
    },
    defaultVariants: { variant: "ghost", size: "sm" }
  });

  export type IconButtonProps = VariantProps<typeof iconButtonVariants>;
</script>

<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  type Props = HTMLButtonAttributes &
    IconButtonProps & {
      class?: string;
      "aria-label": string;
      children?: Snippet;
    };

  let {
    class: className = "",
    variant,
    size,
    type = "button",
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  class={cn(iconButtonVariants({ variant, size }), className)}
  {...rest}>
  {@render children?.()}
</button>
