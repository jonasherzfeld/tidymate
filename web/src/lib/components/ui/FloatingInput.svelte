<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  type Props = HTMLInputAttributes & {
    class?: string;
    label: string;
    error?: boolean;
    leading?: Snippet;
  };

  let {
    class: className = "",
    label,
    error = false,
    leading,
    value = $bindable<string | number | string[] | undefined>(""),
    type = "text",
    ...rest
  }: Props = $props();

  const id = `fi-${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class="relative w-full">
  {#if leading}
    <span class="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
      {@render leading()}
    </span>
  {/if}
  <input
    {id}
    {type}
    bind:value
    placeholder=" "
    class={cn(
      "peer h-12 w-full rounded-field border bg-base-100 px-3 pt-4 pb-1 text-sm outline-none transition-colors",
      "border-neutral focus:border-primary",
      leading && "pl-10",
      error && "border-error focus:border-error",
      className
    )}
    {...rest} />
  <label
    for={id}
    class={cn(
      "text-muted pointer-events-none absolute left-3 top-1/2 origin-[0] -translate-y-1/2 text-sm transition-all duration-150",
      "peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-medium peer-focus:translate-y-0",
      "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:translate-y-0",
      leading && "left-10 peer-focus:left-3 peer-[:not(:placeholder-shown)]:left-3",
      error && "text-error"
    )}>
    {label}
  </label>
</div>
