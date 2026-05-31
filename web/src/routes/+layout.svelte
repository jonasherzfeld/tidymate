<script lang="ts">
  import Sidebar from "$lib/components/Sidebar.svelte";
  import type { Snippet } from "svelte";
  import { browser } from "$app/environment";
  import "../app.css";
  import WebAppMenuBar from "$lib/components/WebAppMenuBar.svelte";
  import { Toaster } from "$lib/components/ui";
  import { setContext } from "svelte";
  import { cn } from "$lib/utils";

  let { children }: { children: Snippet } = $props();

  let isWebApp: boolean = $state(false);
  if (browser) {
    isWebApp = true;
    // window.matchMedia("(display-mode: standalone)").matches ||
    // (window.navigator as any).standalone;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
    }
  }
  setContext("webapp", () => isWebApp);
</script>

<Sidebar>
  <div
    class={cn(
      "flex min-w-full grow",
      isWebApp
        ? "min-h-main-content pb-[calc(theme(spacing.webapp-menu)+env(safe-area-inset-bottom))]"
        : "min-h-main-content-desktop"
    )}>
    {@render children?.()}
  </div>
</Sidebar>
{#if isWebApp}
  <WebAppMenuBar />
{/if}

<Toaster />
