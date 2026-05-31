<script lang="ts">
  import { flip } from "svelte/animate";
  import TaskItem from "$lib/components/TaskItem.svelte";
  import { EmptyState, SectionHeader, Badge } from "$lib/components/ui";
  import { CheckIcon, CalendarIcon } from "$lib/utils/icons";
  import {
    ROOM_CONFIG,
    CATEGORY_CONFIG,
    FREQUENCY_INTERVALS,
    type CategoryConfig
  } from "$lib/utils/constants";

  type Kind = "todo" | "chore" | "reminder";

  type UpNextItem = {
    id: string;
    kind: Kind;
    title: string;
    deadline: string;
    last_done?: string;
    category?: CategoryConfig;
    frequencyDescription?: string;
    daysSinceLastDone?: number;
    dueDays: number;
  };

  let {
    chores = [],
    todos = [],
    reminders = [],
    limit = 5
  }: {
    chores?: Chore[];
    todos?: Todo[];
    reminders?: Reminder[];
    limit?: number;
  } = $props();

  function daysUntil(dateStr: string): number {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 3600 * 24));
  }
  function daysSince(dateStr?: string): number | undefined {
    if (!dateStr) return undefined;
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
  }
  function freqDescription(value?: number): string | undefined {
    if (value === undefined) return undefined;
    return FREQUENCY_INTERVALS.find((f) => f.value === value)?.description;
  }

  const allItems: UpNextItem[] = $derived.by(() => {
    const merged: UpNextItem[] = [];

    for (const c of chores) {
      if (c.done || !c.deadline) continue;
      merged.push({
        id: c.id,
        kind: "chore",
        title: c.data,
        deadline: c.deadline,
        last_done: c.last_done,
        category: ROOM_CONFIG.find((r) => r.name === c.room),
        frequencyDescription: freqDescription(c.frequency),
        daysSinceLastDone: daysSince(c.last_done),
        dueDays: daysUntil(c.deadline)
      });
    }
    for (const r of reminders) {
      if (r.done || !r.deadline) continue;
      merged.push({
        id: r.id,
        kind: "reminder",
        title: r.data,
        deadline: r.deadline,
        last_done: r.last_done,
        category: CATEGORY_CONFIG.find((c) => c.name === r.category),
        frequencyDescription: freqDescription(r.frequency),
        daysSinceLastDone: daysSince(r.last_done),
        dueDays: daysUntil(r.deadline)
      });
    }
    for (const t of todos) {
      if (t.done || !t.deadline) continue;
      merged.push({
        id: t.id,
        kind: "todo",
        title: t.data,
        deadline: t.deadline,
        dueDays: daysUntil(t.deadline)
      });
    }

    return merged.sort((a, b) => a.dueDays - b.dueDays);
  });

  const items = $derived(allItems.slice(0, limit));
  const overdueCount = $derived(allItems.filter((i) => i.dueDays < 0).length);
  const todayCount = $derived(allItems.filter((i) => i.dueDays === 0).length);
</script>

<section class="flex flex-col gap-3">
  <div class="flex items-end justify-between gap-2">
    <SectionHeader title="Up next" subtitle="What needs your attention soon." />
    {#if items.length > 0}
      <div class="flex items-center gap-1.5">
        {#if overdueCount > 0}
          <Badge size="sm" class="bg-error/15 text-error ring-error/30">
            {overdueCount} overdue
          </Badge>
        {/if}
        {#if todayCount > 0}
          <Badge size="sm" class="bg-warning/15 text-warning ring-warning/30">
            <CalendarIcon class="h-3 w-3" />
            {todayCount} today
          </Badge>
        {/if}
      </div>
    {/if}
  </div>

  {#if items.length === 0}
    <EmptyState
      icon={CheckIcon}
      title="You're all caught up"
      description="No chores, reminders, or todos due in the next week." />
  {:else}
    <div class="flex flex-col gap-2">
      {#each items as item (item.id)}
        <div animate:flip={{ duration: 220 }}>
          <TaskItem
            id={item.id}
            title={item.title}
            done={false}
            kind={item.kind}
            category={item.category}
            deadline={item.deadline}
            frequencyDescription={item.frequencyDescription}
            daysSinceLastDone={item.daysSinceLastDone}
            showKind />
        </div>
      {/each}
    </div>
  {/if}
</section>
