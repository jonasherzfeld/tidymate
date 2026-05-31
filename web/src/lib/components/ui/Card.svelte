<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants";

  export const cardVariants = tv({
    base: ["bg-base-100 border border-neutral", "rounded-box shadow-[var(--shadow-sm)]"],
    variants: {
      interactive: {
        true: [
          "transition-[box-shadow,transform,border-color] duration-200",
          "hover:shadow-[var(--shadow-md)] hover:-translate-y-px",
          "hover:border-base-content/15"
        ],
        false: ""
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-6"
      }
    },
    defaultVariants: { interactive: false, padding: "md" }
  });

  export type CardProps = VariantProps<typeof cardVariants>;
</script>

<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  type Props = HTMLAttributes<HTMLDivElement> &
    CardProps & {
      class?: string;
      children?: Snippet;
    };

  let { class: className = "", interactive, padding, children, ...rest }: Props = $props();
</script>

<div class={cn(cardVariants({ interactive, padding }), className)} {...rest}>
  {@render children?.()}
</div>
