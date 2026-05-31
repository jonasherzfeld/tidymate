<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { Check, AlertCircle, Info, X } from "lucide-svelte";
  import { getToasts, dismissToast, type ToastKind } from "./toast.svelte";
  import { cn } from "$lib/utils";

  const toasts = getToasts();

  type Style = { icon: string; accent: string };
  const styleFor: Record<ToastKind, Style> = {
    success: { icon: "bg-success/15 text-success", accent: "bg-success" },
    error: { icon: "bg-error/15 text-error", accent: "bg-error" },
    info: { icon: "bg-info/15 text-info", accent: "bg-info" }
  };

  function iconFor(kind: ToastKind) {
    if (kind === "success") return Check;
    if (kind === "error") return AlertCircle;
    return Info;
  }
</script>

<div
  class="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-auto sm:right-4 sm:left-auto sm:top-4 sm:items-end">
  {#each toasts as t (t.id)}
    {@const Icon = iconFor(t.kind)}
    {@const style = styleFor[t.kind]}
    <div
      animate:flip={{ duration: 200 }}
      in:fly={{ y: 16, duration: 220 }}
      out:fade={{ duration: 140 }}
      class={cn(
        "pointer-events-auto bg-base-100 border-neutral relative flex w-full items-start gap-3 overflow-hidden rounded-box border p-3 pl-4 shadow-[var(--shadow-lg)] sm:max-w-sm"
      )}>
      <span class={cn("absolute inset-y-0 left-0 w-1", style.accent)}></span>
      <div
        class={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          style.icon
        )}>
        <Icon class="h-4 w-4" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-base-content text-sm font-semibold">{t.title}</div>
        {#if t.description}
          <div class="text-base-content/70 mt-0.5 text-xs leading-relaxed">
            {t.description}
          </div>
        {/if}
      </div>
      <button
        class="text-base-content/50 hover:text-base-content hover:bg-base-200 -m-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-field transition-colors"
        aria-label="Dismiss"
        onclick={() => dismissToast(t.id)}>
        <X class="h-3.5 w-3.5" />
      </button>
    </div>
  {/each}
</div>
