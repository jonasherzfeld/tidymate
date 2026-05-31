<script lang="ts">
  import { Sheet } from "$lib/components/ui";
  import ItemStats from "$lib/components/items-page/ItemStats.svelte";
  import ItemHistory from "$lib/components/items-page/ItemHistory.svelte";
  import { StatisticsIcon, HistoryIcon } from "$lib/utils/icons";
  import { cn } from "$lib/utils";

  type ItemType = "todo" | "chore" | "reminder";

  let {
    open = $bindable(false),
    itemType,
    itemPageState,
    title = "Insights"
  }: {
    open?: boolean;
    itemType: ItemType;
    itemPageState: ItemListState<any>;
    title?: string;
  } = $props();

  let activeTab: "stats" | "history" = $state("stats");
</script>

<Sheet bind:open side="right" {title} description="Stats and history">
  <div class="flex flex-col gap-4">
    <!-- Segmented tabs -->
    <div class="border-neutral bg-base-200 rounded-field inline-flex border p-1">
      <button
        type="button"
        class={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-[calc(var(--radius-field)-2px)] px-3 py-1.5 text-sm font-medium transition-colors",
          activeTab === "stats"
            ? "bg-base-100 text-base-content shadow-[var(--shadow-xs)]"
            : "text-muted hover:text-base-content"
        )}
        onclick={() => (activeTab = "stats")}>
        <StatisticsIcon class="h-4 w-4" />
        Stats
      </button>
      <button
        type="button"
        class={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-[calc(var(--radius-field)-2px)] px-3 py-1.5 text-sm font-medium transition-colors",
          activeTab === "history"
            ? "bg-base-100 text-base-content shadow-[var(--shadow-xs)]"
            : "text-muted hover:text-base-content"
        )}
        onclick={() => (activeTab = "history")}>
        <HistoryIcon class="h-4 w-4" />
        History
      </button>
    </div>

    <div>
      {#if activeTab === "stats"}
        <ItemStats item_type={itemType} {itemPageState} />
      {:else}
        <ItemHistory {itemPageState} {itemType} />
      {/if}
    </div>
  </div>
</Sheet>
