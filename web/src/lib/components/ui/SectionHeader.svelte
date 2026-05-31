<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  let {
    title,
    subtitle,
    class: className = "",
    actions
  }: {
    title: string;
    subtitle?: string;
    class?: string;
    actions?: Snippet;
  } = $props();
</script>

<div class={cn("flex items-start justify-between gap-3", className)}>
  <div class="min-w-0 flex-1">
    <h2 class="text-base-content m-0 block p-0 text-lg leading-tight font-semibold">
      {title}
    </h2>
    {#if subtitle}
      <p class="text-muted m-0 mt-1 block p-0 text-sm leading-snug">{subtitle}</p>
    {/if}
  </div>
  {#if actions}
    <div class="flex shrink-0 items-center gap-2">
      {@render actions()}
    </div>
  {/if}
</div>
