<script lang="ts">
  import Sidebar from "$lib/components/Sidebar.svelte";
  import type { Snippet } from "svelte";
  import { browser } from "$app/environment";
  import "../app.css";
  import WebAppMenuBar from "$lib/components/WebAppMenuBar.svelte";
  import { setContext } from "svelte";
  import { cn } from "$lib/utils";

  let { children }: { children: Snippet } = $props();

  let isWebApp: boolean = $state(false);
  if (browser) {
    isWebApp =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;
  }
  setContext("webapp", isWebApp);

  let isPageLoaded = $state(false);
  const handlePageLoaded = (e: HTMLDivElement) => {
    isPageLoaded = true;
  };
</script>

{#if !isPageLoaded}
  <div class="flex h-screen items-center justify-center" use:handlePageLoaded>
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{/if}
<Sidebar>
  <div
    class={cn(
      "flex min-w-full grow",
      isWebApp
        ? "min-h-main-content pb-webapp-menu"
        : "min-h-main-content-desktop"
    )}>
    {@render children?.()}
  </div>
</Sidebar>
{#if isWebApp}
  <WebAppMenuBar />
{/if}
