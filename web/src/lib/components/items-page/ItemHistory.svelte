<script lang="ts">
  import ActivityTimelineItem from "$lib/components/ActivityTimelineItem.svelte";
  import { enhance } from "$app/forms";
  import { Badge, Button, Card, EmptyState, SectionHeader } from "$lib/components/ui";
  import { HistoryIcon, DeleteIcon } from "$lib/utils/icons";

  let {
    itemPageState,
    itemType
  }: {
    itemPageState: ItemListState<Chore | Reminder | Todo>;
    itemType: string;
  } = $props();

  let history = $derived(itemPageState.history);
  let isDeleting = $state(false);

  let groupedHistory = $derived.by(() => {
    const groups: Record<string, History[]> = {};

    for (const event of history) {
      const date = new Date(event.created_on).toDateString();
      (groups[date] ??= []).push(event);
    }

    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => ({
        date,
        events: groups[date].sort(
          (a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
        )
      }));
  });

  let counts = $derived({
    total: history.length,
    completed: history.filter((h) => h.event_type === "completed").length,
    created: history.filter((h) => h.event_type === "created").length,
    deleted: history.filter((h) => h.event_type === "deleted").length
  });

  function formatDate(dateString: string): string {
    const d = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric"
    });
  }

  function itemTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  const handleDeleteHistory = async ({ cancel }) => {
    if (
      !confirm(
        `Clear all ${itemTypeLabel(itemType).toLowerCase()} history? This can't be undone.`
      )
    ) {
      return cancel();
    }

    isDeleting = true;
    return async ({ result, update }) => {
      if (result.status === 200) {
        itemPageState.history = [];
      }
      isDeleting = false;
      await update();
    };
  };
</script>

<div class="flex w-full flex-col gap-5">
  {#if history.length === 0}
    <EmptyState
      icon={HistoryIcon}
      title="No activity yet"
      description="Create or complete a {itemType} to start building your history." />
  {:else}
    <Card padding="md">
      <SectionHeader title="Summary" subtitle="All-time activity for this list.">
        {#snippet actions()}
          <form
            action="/home/?/delete_history&item_type={itemType}"
            method="POST"
            use:enhance={handleDeleteHistory}>
            <Button type="submit" variant="outline" size="xs" loading={isDeleting}>
              <DeleteIcon class="h-3.5 w-3.5" />
              Clear
            </Button>
          </form>
        {/snippet}
      </SectionHeader>

      <dl class="mt-4 grid grid-cols-4 gap-2">
        <div class="bg-base-200 rounded-field flex flex-col items-center gap-0.5 px-2 py-3">
          <dt class="text-muted text-[11px] font-medium tracking-wide uppercase">Total</dt>
          <dd class="text-base-content text-xl font-semibold tabular-nums">{counts.total}</dd>
        </div>
        <div class="bg-success/10 rounded-field flex flex-col items-center gap-0.5 px-2 py-3">
          <dt class="text-success/80 text-[11px] font-medium tracking-wide uppercase">Done</dt>
          <dd class="text-success text-xl font-semibold tabular-nums">{counts.completed}</dd>
        </div>
        <div class="bg-info/10 rounded-field flex flex-col items-center gap-0.5 px-2 py-3">
          <dt class="text-info/80 text-[11px] font-medium tracking-wide uppercase">New</dt>
          <dd class="text-info text-xl font-semibold tabular-nums">{counts.created}</dd>
        </div>
        <div class="bg-error/10 rounded-field flex flex-col items-center gap-0.5 px-2 py-3">
          <dt class="text-error/80 text-[11px] font-medium tracking-wide uppercase">Deleted</dt>
          <dd class="text-error text-xl font-semibold tabular-nums">{counts.deleted}</dd>
        </div>
      </dl>
    </Card>

    <div class="flex flex-col gap-5">
      {#each groupedHistory as { date, events } (date)}
        <section class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <h3 class="text-base-content text-sm font-semibold leading-none">
              {formatDate(date)}
            </h3>
            <Badge size="xs" variant="neutral">{events.length}</Badge>
          </div>

          <div class="flex flex-col gap-2">
            {#each events as event (event.id ?? event.created_on)}
              <ActivityTimelineItem {event} />
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {/if}
</div>
