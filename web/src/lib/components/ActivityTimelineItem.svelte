<script lang="ts">
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import {
    ReminderIcon,
    TodoIcon,
    ChoresIcon,
    GeneralIcon
  } from "$lib/utils/icons";

  let { event }: { event: History } = $props();

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
  class="card card-bordered border-neutral bg-base-300 flex h-fit w-full flex-row items-start justify-between rounded-lg p-2 shadow-sm">
  <!-- Event Icon -->
  <div class="flex h-full w-fit flex-col justify-start">
    <div class="text-lg">
      {getEventIcon(event.event_type)}
    </div>
    <div class="text-base-content/50 font-mono text-xs">
      {formatTime(event.created_on)}
    </div>
  </div>

  <!-- Main Content -->
  <div
    class="justify-left mt-0 flex h-fit grow flex-col gap-0.5 pl-4 pr-2 pt-0 text-left">
    <!-- First Row: Item Type Badge -->
    <div class="flex flex-row items-center">
      <div
        class="badge gap-1 {getItemTypeColor(
          event.item_type
        )} badge-xs h-5 items-center text-white">
        {#if event.item_type === "reminder"}
          <ReminderIcon class="h-2.5 w-2.5 opacity-50" />
        {:else if event.item_type === "todo"}
          <TodoIcon class="h-2.5 w-2.5 opacity-50" />
        {:else if event.item_type === "chore"}
          <ChoresIcon class="h-2.5 w-2.5 opacity-50" />
        {:else}
          <GeneralIcon class="h-2.5 w-2.5 opacity-50" />
        {/if}
        {event.item_type}
      </div>
    </div>

    <!-- Second Row: User and Action -->
    <div class="flex flex-row items-center gap-2">
      <span class="text-xs font-medium">
        {event.user?.first_name}
        {event.user?.last_name}
      </span>
      <span class="{getEventColor(event.event_type)} text-xs">
        {getEventDescription(event)}
      </span>
    </div>

    <!-- Third Row: Item Data (if exists) -->
    {#if event.item_data}
      <div class="flex flex-row items-center">
        <span class="text-base-content/70 text-xs">
          "{event.item_data}"
        </span>
      </div>
    {/if}
  </div>

  <!-- Right Side: Time and Avatar -->
  <!-- <div class="flex h-full w-fit flex-col items-end justify-start gap-1">
    <div class="text-base-content/70 font-mono text-xs">
      {formatTime(event.created_on)}
    </div>
    <div class="avatar">
      <AvatarGraphic
        thumbnail={event.user?.thumbnail || ""}
        height="h-6"
        width="w-6"
        textSize="text-[0.4rem]" />
    </div>
  </div> -->
</div>
