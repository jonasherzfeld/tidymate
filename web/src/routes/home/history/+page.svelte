<script lang="ts">
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import type { PageData } from "./$types";
  import {
    ChevronLeft,
    ReminderIcon,
    TodoIcon,
    ChoresIcon,
    GeneralIcon
  } from "$lib/utils/icons";

  let { data }: { data: PageData } = $props();

  const history: History[] = $derived(data.history || []);

  // Group history by date
  const groupedHistory = $derived.by(() => {
    const groups: Record<string, History[]> = {};

    history.forEach((event) => {
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
  function getEventIcon(eventType: string): string {
    switch (eventType) {
      case "completed":
        return "✅";
      case "created":
        return "➕";
      case "deleted":
        return "🗑️";
      default:
        return "📝";
    }
  }

  function getEventColor(eventType: string): string {
    switch (eventType) {
      case "completed":
        return "text-success";
      case "created":
        return "text-info";
      case "deleted":
        return "text-error";
      default:
        return "text-base-content";
    }
  }

  function getItemTypeIcon(itemType: string): string {
    switch (itemType) {
      case "chore":
        return "🧹";
      case "todo":
        return "📋";
      case "reminder":
        return "⏰";
      default:
        return "📝";
    }
  }

  function getItemTypeColor(itemType: string): string {
    switch (itemType) {
      case "chore":
        return "badge-warning";
      case "todo":
        return "badge-primary";
      case "reminder":
        return "badge-secondary";
      default:
        return "badge-neutral";
    }
  }

  function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function getEventDescription(event: History): string {
    const action = event.event_type;
    const itemType = event.item_type;
    const itemName =
      event.item_data || `${itemType} #${event.item_id.substring(0, 8)}`;

    switch (action) {
      case "completed":
        return `completed ${itemType}`;
      case "created":
        return `created new ${itemType}`;
      case "deleted":
        return `deleted ${itemType}`;
      default:
        return `${action} ${itemType}`;
    }
  }
</script>

<div
  class="bg-base-100 flex min-h-full w-full flex-1 items-start justify-center">
  <div
    class="mt-5 flex w-full max-w-screen-lg flex-1 flex-col justify-center gap-5 p-4">
    <div class="flex flex-col">
      <div class="relative mt-3 flex items-center justify-start">
        <a href="/home" class="flex items-center gap-1"><ChevronLeft />Back</a>
      </div>
      <div class="relative start-0 flex min-w-full items-center justify-center">
        <h1 class="text-4xl font-bold">Activity History</h1>
      </div>
    </div>

    {#if history.length === 0}
      <div class="card bg-base-200 shadow">
        <div class="card-body text-center">
          <div class="mb-4 text-6xl">📋</div>
          <h2 class="card-title justify-center">No Activity Yet</h2>
          <p>
            Start creating and completing tasks to see your activity history
            here!
          </p>
        </div>
      </div>
    {:else}
      <!-- Statistics Summary -->
      <div class="card bg-base-200 shadow">
        <div class="card-body">
          <h2 class="card-title mb-4">Summary</h2>
          <div
            class="stats stats-vertical md:stats-horizontal bg-base-300 shadow">
            <div class="stat">
              <div class="stat-title">Total Events</div>
              <div class="stat-value text-primary">{history.length}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Completed</div>
              <div class="stat-value text-success">
                {history.filter((h) => h.event_type === "completed").length}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Created</div>
              <div class="stat-value text-info">
                {history.filter((h) => h.event_type === "created").length}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Deleted</div>
              <div class="stat-value text-error">
                {history.filter((h) => h.event_type === "deleted").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Timeline -->
      <div class="space-y-6">
        {#each groupedHistory as { date, events }}
          <div class="card bg-base-200 shadow">
            <div class="card-body">
              <h3 class="mb-4 text-center text-xl font-semibold">
                {formatDate(date)}
              </h3>

              <div class="space-y-3">
                {#each events as event}
                  <div
                    class="bg-base-300 hover:bg-base-100 flex items-center gap-4 rounded-lg p-3 transition-colors">
                    <!-- Time -->
                    <div class="text-base-content/70 w-20 font-mono text-sm">
                      {formatTime(event.created_on)}
                    </div>

                    <!-- Event Icon -->
                    <div class="text-2xl">
                      {getEventIcon(event.event_type)}
                    </div>

                    <!-- User Avatar -->
                    <div class="avatar">
                      <AvatarGraphic
                        thumbnail={event.user?.thumbnail || ""}
                        height="h-10"
                        width="w-10"
                        textSize="text-xs" />
                    </div>

                    <!-- Event Details -->
                    <div class="flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="font-medium">
                          {event.user?.first_name}
                          {event.user?.last_name}
                        </span>
                        <span class={getEventColor(event.event_type)}>
                          {getEventDescription(event)}
                        </span>
                        <div
                          class=" badge gap-1 {getItemTypeColor(
                            event.item_type
                          )} badge-sm">
                          {#if event.item_type === "reminder"}
                            <ReminderIcon class="h-3 w-3  opacity-50" />
                          {:else if event.item_type === "todo"}
                            <TodoIcon class="h-3 w-3  opacity-50" />
                          {:else if event.item_type === "chore"}
                            <ChoresIcon class="h-3 w-3  opacity-50" />
                          {:else}
                            <GeneralIcon class="h-3 w-3 opacity-50" />
                          {/if}
                          {event.item_type}
                        </div>
                      </div>

                      {#if event.item_data}
                        <div class="text-base-content/70 mt-1 text-sm">
                          "{event.item_data}"
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
