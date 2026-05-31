<script lang="ts">
  import { Dialog } from "bits-ui";
  import type { Snippet } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { X } from "lucide-svelte";
  import { cn } from "$lib/utils";

  type Side = "right" | "bottom";

  let {
    open = $bindable(false),
    side = "right",
    title,
    description,
    class: className = "",
    children,
    trigger,
    footer
  }: {
    open?: boolean;
    side?: Side;
    title?: string;
    description?: string;
    class?: string;
    children?: Snippet;
    trigger?: Snippet;
    footer?: Snippet;
  } = $props();

  const sideClasses: Record<Side, string> = {
    right:
      "fixed right-0 top-0 bottom-0 w-full max-w-md border-l border-neutral pt-[calc(env(safe-area-inset-top)+theme(spacing.header))]",
    bottom: "fixed inset-x-0 bottom-0 max-h-[92dvh] w-full border-t border-neutral rounded-t-box"
  };

  const flyParams: Record<Side, { x?: number; y?: number; duration: number }> = {
    right: { x: 360, duration: 240 },
    bottom: { y: 360, duration: 280 }
  };
</script>

<Dialog.Root bind:open>
  {#if trigger}
    <Dialog.Trigger>
      {@render trigger()}
    </Dialog.Trigger>
  {/if}

  <Dialog.Portal>
    <Dialog.Overlay forceMount>
      {#snippet child({ props, open })}
        {#if open}
          <div
            {...props}
            class="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            transition:fade={{ duration: 160, easing: cubicOut }}>
          </div>
        {/if}
      {/snippet}
    </Dialog.Overlay>

    <Dialog.Content forceMount>
      {#snippet child({ props, open })}
        {#if open}
          <div
            {...props}
            class={cn(
              "bg-base-100 z-50 flex flex-col shadow-[var(--shadow-lg)]",
              sideClasses[side],
              className
            )}
            transition:fly={{ ...flyParams[side], easing: cubicOut }}>
            {#if title || description}
              <div class="border-neutral flex items-start justify-between gap-3 border-b p-5">
                <div class="min-w-0 flex-1">
                  {#if title}
                    <Dialog.Title class="text-lg font-semibold tracking-tight">
                      {title}
                    </Dialog.Title>
                  {/if}
                  {#if description}
                    <Dialog.Description class="text-muted mt-1 text-sm">
                      {description}
                    </Dialog.Description>
                  {/if}
                </div>
                <Dialog.Close
                  class="text-muted hover:bg-base-200 hover:text-base-content rounded-field -m-1 inline-flex h-8 w-8 items-center justify-center transition-colors"
                  aria-label="Close">
                  <X class="h-4 w-4" />
                </Dialog.Close>
              </div>
            {/if}

            <div class="flex-1 overflow-y-auto p-5">
              {@render children?.()}
            </div>

            {#if footer}
              <div class="border-neutral border-t p-4">
                {@render footer()}
              </div>
            {/if}
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
