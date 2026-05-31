<script lang="ts">
  import { ROOM_CONFIG, CATEGORY_CONFIG, type CategoryConfig } from "$lib/utils/constants";
  import { Badge } from "$lib/components/ui";
  import {
    CheckIcon,
    ChoresIcon,
    DeleteIcon,
    PlusIcon,
    ReminderIcon,
    TextIcon,
    TodoIcon
  } from "$lib/utils/icons";
  import { cn } from "$lib/utils";
  import type { Component } from "svelte";

  let { event }: { event: History } = $props();

  type EventMeta = {
    icon: Component;
    iconTint: string;
    label: string;
    verb: string;
  };

  const EVENT_META: Record<string, EventMeta> = {
    completed: {
      icon: CheckIcon,
      iconTint: "bg-success/15 text-success ring-success/25",
      label: "Completed",
      verb: "completed"
    },
    created: {
      icon: PlusIcon,
      iconTint: "bg-info/15 text-info ring-info/25",
      label: "Created",
      verb: "created"
    },
    deleted: {
      icon: DeleteIcon,
      iconTint: "bg-error/15 text-error ring-error/25",
      label: "Deleted",
      verb: "deleted"
    }
  };

  const FALLBACK_META: EventMeta = {
    icon: TextIcon,
    iconTint: "bg-base-200 text-base-content/70 ring-base-content/10",
    label: "Updated",
    verb: "updated"
  };

  const KIND_META: Record<string, { icon: Component; label: string; tint: string }> = {
    chore: {
      icon: ChoresIcon,
      label: "Chore",
      tint: "bg-primary/10 text-primary ring-primary/20"
    },
    reminder: {
      icon: ReminderIcon,
      label: "Reminder",
      tint: "bg-secondary/10 text-secondary ring-secondary/20"
    },
    todo: {
      icon: TodoIcon,
      label: "Todo",
      tint: "bg-base-content/10 text-base-content/70 ring-base-content/15"
    }
  };

  let eventMeta = $derived(EVENT_META[event.event_type] ?? FALLBACK_META);
  let kindMeta = $derived(KIND_META[event.item_type] ?? KIND_META.todo);

  function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  let categoryConfig: CategoryConfig | undefined = $derived.by(() => {
    if (!event.item) return undefined;
    if (event.item_type === "chore") {
      return ROOM_CONFIG.find((item) => item.name === event.item.room);
    }
    if (event.item_type === "reminder") {
      return CATEGORY_CONFIG.find((item) => item.name === event.item.category);
    }
    return undefined;
  });

  let itemLabel = $derived(event.item?.data ?? event.item_data ?? "Unnamed item");
  let userName = $derived(
    [event.user?.first_name, event.user?.last_name].filter(Boolean).join(" ") || "Someone"
  );
</script>

<div
  class={cn(
    "group bg-base-100 border-neutral relative flex items-start gap-3 rounded-field border px-3 py-3",
    "transition-all duration-200 ease-[var(--ease-smooth)]",
    "hover:border-base-content/15 hover:shadow-[var(--shadow-sm)]"
  )}>
  <span
    title={eventMeta.label}
    aria-label={eventMeta.label}
    class={cn(
      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1 ring-inset",
      eventMeta.iconTint
    )}>
    <eventMeta.icon class="h-3.5 w-3.5" />
  </span>

  <div class="min-w-0 flex-1">
    <div class="flex flex-wrap items-center gap-1.5">
      <Badge size="xs" class={cn("ring-inset !ring-1", kindMeta.tint)}>
        <kindMeta.icon class="h-3 w-3" />
        {kindMeta.label}
      </Badge>
      {#if categoryConfig}
        <Badge size="xs" class={cn("ring-inset !ring-1", categoryConfig.tint)}>
          <categoryConfig.icon class="h-3 w-3" />
          {categoryConfig.name}
        </Badge>
      {/if}
      <span class="text-muted ml-auto font-mono text-[11px]">
        {formatTime(event.created_on)}
      </span>
    </div>

    <p class="text-base-content mt-1.5 truncate text-sm leading-snug">
      <span class="font-medium">{userName}</span>
      <span class="text-muted">{eventMeta.verb}</span>
      <span class="font-medium">"{itemLabel}"</span>
    </p>
  </div>
</div>
