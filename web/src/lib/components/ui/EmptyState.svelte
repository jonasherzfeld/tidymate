<script lang="ts">
  import type { Snippet, Component } from "svelte";
  import { cn } from "$lib/utils";

  let {
    icon,
    title,
    description,
    class: className = "",
    action
  }: {
    icon?: Component;
    title: string;
    description?: string;
    class?: string;
    action?: Snippet;
  } = $props();
</script>

<div
  class={cn(
    "flex flex-col items-center justify-center text-center",
    "border-neutral rounded-box border border-dashed",
    "bg-base-100 px-6 py-12",
    className
  )}>
  {#if icon}
    {@const Icon = icon}
    <div
      class="text-primary bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
      <Icon class="h-6 w-6" />
    </div>
  {/if}
  <h3 class="text-base-content text-base font-semibold tracking-tight">
    {title}
  </h3>
  {#if description}
    <p class="text-muted mt-1 max-w-sm text-sm">
      {description}
    </p>
  {/if}
  {#if action}
    <div class="mt-5">
      {@render action()}
    </div>
  {/if}
</div>
