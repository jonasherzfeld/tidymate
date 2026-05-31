<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants";

  export const badgeVariants = tv({
    base: ["inline-flex items-center gap-1 font-medium whitespace-nowrap", "ring-1 ring-inset"],
    variants: {
      variant: {
        neutral: "bg-base-200 text-base-content/80 ring-base-content/10",
        primary: "bg-primary/10 text-primary ring-primary/20",
        success: "bg-success/15 text-success ring-success/25",
        warning: "bg-warning/15 text-warning ring-warning/25",
        error: "bg-error/15 text-error ring-error/25",
        info: "bg-info/15 text-info ring-info/25"
      },
      size: {
        xs: "h-5 px-1.5 text-[10px] rounded-md",
        sm: "h-6 px-2 text-xs rounded-md",
        md: "h-7 px-2.5 text-xs rounded-lg"
      }
    },
    defaultVariants: { variant: "neutral", size: "sm" }
  });

  export type BadgeProps = VariantProps<typeof badgeVariants>;
</script>

<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  type Props = HTMLAttributes<HTMLSpanElement> &
    BadgeProps & {
      class?: string;
      children?: Snippet;
    };

  let { class: className = "", variant, size, children, ...rest }: Props = $props();
</script>

<span class={cn(badgeVariants({ variant, size }), className)} {...rest}>
  {@render children?.()}
</span>
