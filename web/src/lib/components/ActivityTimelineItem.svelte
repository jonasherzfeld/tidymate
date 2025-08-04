<script lang="ts">
  import {
    ROOM_CONFIG,
    CATEGORY_CONFIG,
    type CategoryConfig
  } from "$lib/utils/constants";

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

  let defaultCategoryConfig: CategoryConfig | undefined = $derived(
    ROOM_CONFIG.find((item) => item.name === "General")
  );
  let categoryConfig: CategoryConfig | undefined = $derived.by(() => {
    if (event.item_type === "chore") {
      return ROOM_CONFIG.find((item) => item.name === event.item.room);
    } else if (event.item_type === "reminder") {
      return CATEGORY_CONFIG.find((item) => item.name === event.item.category);
    } else if (event.item_type === "todo") {
      return CATEGORY_CONFIG.find((item) => item.name === "General");
    }
  });
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
    class="justify-left mt-0 flex h-fit grow flex-col gap-0.5 pt-0 pr-2 pl-4 text-left">
    <!-- First Row: Item Type Badge -->
    {#if event.item_type !== "todo"}
      <div class="flex flex-row items-center">
        <div
          class={`badge  h-6 items-center gap-1 text-white ${categoryConfig ? categoryConfig.color : defaultCategoryConfig?.color}`}>
          {#if categoryConfig}
            <categoryConfig.icon />
            {categoryConfig.name}
          {:else if defaultCategoryConfig}
            <defaultCategoryConfig.icon />
            {defaultCategoryConfig.name}
          {/if}
        </div>
      </div>
    {/if}

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
    {#if event.item && event.item.data}
      <div class="flex flex-row items-center">
        <span class="text-base-content/70 text-xs">
          "{event.item.data}"
        </span>
      </div>
    {:else if event.item_data}
      <div class="flex flex-row items-center">
        <span class="text-base-content/70 text-xs">
          {event.item_data || "Unnamed Item"}
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
