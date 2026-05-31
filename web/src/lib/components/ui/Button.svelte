<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants";

  export const buttonVariants = tv({
    base: [
      "inline-flex items-center justify-center gap-2 whitespace-nowrap",
      "rounded-field font-medium select-none",
      "transition-[transform,box-shadow,background-color,color,border-color] duration-150",
      "outline-none focus-visible:shadow-[var(--shadow-focus)]",
      "active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
    ],
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-content shadow-sm",
          "hover:bg-primary/90 hover:shadow-md",
          "border border-transparent"
        ],
        secondary: ["bg-base-200 text-base-content border border-neutral", "hover:bg-base-300"],
        soft: ["bg-primary/10 text-primary border border-transparent", "hover:bg-primary/15"],
        ghost: ["bg-transparent text-base-content border border-transparent", "hover:bg-base-200"],
        outline: [
          "bg-transparent text-base-content border border-neutral",
          "hover:bg-base-200 hover:border-base-content/20"
        ],
        accent: [
          "bg-accent text-accent-content shadow-sm border border-transparent",
          "hover:bg-accent/90 hover:shadow-md"
        ],
        destructive: [
          "bg-error text-error-content shadow-sm border border-transparent",
          "hover:bg-error/90"
        ],
        link: "bg-transparent text-primary underline-offset-4 hover:underline border-transparent"
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base"
      },
      block: { true: "w-full", false: "" }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false
    }
  });

  export type ButtonProps = VariantProps<typeof buttonVariants>;
</script>

<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  type Props = HTMLButtonAttributes &
    ButtonProps & {
      class?: string;
      loading?: boolean;
      children?: Snippet;
    };

  let {
    class: className = "",
    variant,
    size,
    block,
    loading = false,
    disabled,
    type = "button",
    children,
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  class={cn(buttonVariants({ variant, size, block }), className)}
  disabled={disabled || loading}
  {...rest}>
  {#if loading}
    <span class="loading loading-spinner loading-sm"></span>
  {/if}
  {@render children?.()}
</button>
