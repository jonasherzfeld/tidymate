<script lang="ts">
  import ActivityTimelineItem from "$lib/components/ActivityTimelineItem.svelte";

  let {
    itemPageState
  }: { itemPageState: ItemListState<Chore | Reminder | Todo> } = $props();

  let history = $derived(() => itemPageState.history);

  // Group history by date
  let groupedHistory = $derived.by(() => {
    const groups: Record<string, History[]> = {};

    history().forEach((event) => {
      const date = new Date(event.created_on).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });

    // Sort dates in descending order
    const sortedDates = Object.keys(groups).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedDates.map((date) => ({
      date,
      events: groups[date].sort(
        (a, b) =>
          new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
      )
    }));
  });

  // Helper functions
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
</script>

<div class="flex w-full max-w-screen-lg flex-1 flex-col justify-center gap-5">
  {#if history().length === 0}
    <div class="card bg-base-200 shadow">
      <div class="card-body p-3 text-center">
        <div class="mb-4 text-6xl">📋</div>
        <h2 class="card-title justify-center">No Activity Yet</h2>
        <p>
          Start creating and completing tasks to see your activity history here!
        </p>
      </div>
    </div>
  {:else}
    <!-- Statistics Summary -->
    <div class="card bg-base-200 shadow">
      <div class="card-body p-3">
        <h2 class="card-title mb-4">Summary</h2>
        <div class="stats stats-horizontal bg-base-300 p-0 pt-2 shadow">
          <div class="stat m-0 min-w-12 p-0">
            <div class="m-0 p-0 text-xs">Total</div>
            <div class="stat-value text-primary m-0 p-0">
              {history().length}
            </div>
          </div>
          <div class="stat m-0 min-w-12 p-0">
            <div class="m-0 p-0 text-xs">Completed</div>
            <div class="stat-value text-success m-0 p-0">
              {history().filter((h) => h.event_type === "completed").length}
            </div>
          </div>
          <div class="stat m-0 min-w-12 p-0">
            <div class="m-0 p-0 text-xs">Created</div>
            <div class="stat-value text-info m-0 p-0">
              {history().filter((h) => h.event_type === "created").length}
            </div>
          </div>
          <div class="stat m-0 min-w-12 p-0">
            <div class="m-0 p-0 text-xs">Deleted</div>
            <div class="stat-value text-error m-0 p-0">
              {history().filter((h) => h.event_type === "deleted").length}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="space-y-6">
      {#each groupedHistory as { date, events }}
        <div class="card bg-base-200 shadow">
          <div class="card-body p-3">
            <h3 class="mb-4 text-center text-xl font-semibold">
              {formatDate(date)}
            </h3>

            <div class="space-y-3">
              {#each events as event}
                <ActivityTimelineItem {event} />
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
