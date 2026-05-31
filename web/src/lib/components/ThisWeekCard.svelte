<script lang="ts">
  import { Card, Sparkline, Badge } from "$lib/components/ui";
  import WeeklyTimeline from "./WeeklyTimeline.svelte";

  type CompletedItem = {
    id: string;
    name: string;
    kind: "todo" | "chore" | "reminder";
    category: string | null;
    completed_at: string;
  };

  let {
    completedThisWeek,
    completedPrevWeek,
    dailyCounts,
    streakDays,
    completionsByDate = {},
    chores = [],
    todos = [],
    reminders = []
  }: {
    completedThisWeek: number;
    completedPrevWeek: number;
    /** 14 ints, oldest first → newest. Last 7 = this week, first 7 = prev week. */
    dailyCounts: number[];
    streakDays: number;
    completionsByDate?: Record<string, CompletedItem[]>;
    chores?: Chore[];
    todos?: Todo[];
    reminders?: Reminder[];
  } = $props();

  const delta = $derived(completedThisWeek - completedPrevWeek);
  const deltaPercent = $derived.by(() => {
    if (completedPrevWeek === 0) return completedThisWeek > 0 ? 100 : 0;
    return Math.round((delta / completedPrevWeek) * 100);
  });

  const deltaLabel = $derived.by(() => {
    if (delta === 0) return "Same as last week";
    const arrow = delta > 0 ? "▲" : "▼";
    return `${arrow} ${Math.abs(delta)} vs last week`;
  });

  const deltaVariant = $derived(delta > 0 ? "success" : delta < 0 ? "warning" : "neutral");

  // ----- Activity rings: chores & reminders done / total this week -----------

  function isoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const weekRange = (() => {
    const start = new Date();
    const dow = start.getDay();
    start.setDate(start.getDate() + (dow === 0 ? -6 : 1 - dow));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { startIso: isoDate(start), endIso: isoDate(end) };
  })();

  function countDoneThisWeek(kind: "chore" | "reminder"): number {
    let n = 0;
    for (const [iso, items] of Object.entries(completionsByDate)) {
      if (iso < weekRange.startIso || iso > weekRange.endIso) continue;
      for (const item of items) if (item.kind === kind) n++;
    }
    return n;
  }

  function countPlannedThisWeek(items: { deadline?: string; done: boolean }[]): number {
    return items.filter((i) => {
      if (i.done || !i.deadline) return false;
      const d = i.deadline.slice(0, 10);
      return d >= weekRange.startIso && d <= weekRange.endIso;
    }).length;
  }

  const choresDone = $derived(countDoneThisWeek("chore"));
  const remindersDone = $derived(countDoneThisWeek("reminder"));
  const choresTotal = $derived(choresDone + countPlannedThisWeek(chores));
  const remindersTotal = $derived(remindersDone + countPlannedThisWeek(reminders));

  // Ring geometry
  const ringSize = 84;
  const ringStroke = 9;
  const ringGap = 3;
  const outerR = (ringSize - ringStroke) / 2 - 1;
  const innerR = outerR - ringStroke - ringGap;
  const outerCirc = 2 * Math.PI * outerR;
  const innerCirc = 2 * Math.PI * innerR;

  const choresPct = $derived(choresTotal > 0 ? Math.min(choresDone / choresTotal, 1) : 0);
  const remindersPct = $derived(
    remindersTotal > 0 ? Math.min(remindersDone / remindersTotal, 1) : 0
  );
</script>

<Card padding="md" class="flex flex-col gap-5">
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div class="min-w-0">
      <div class="text-muted text-xs font-medium tracking-wide uppercase">This week</div>
      <div class="mt-1 flex items-baseline gap-2">
        <span class="text-base-content text-4xl font-semibold tabular-nums">
          {completedThisWeek}
        </span>
        <span class="text-muted text-sm">completed</span>
      </div>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <Badge size="sm" variant={deltaVariant}>
          {deltaLabel}{completedPrevWeek > 0 && delta !== 0
            ? ` (${deltaPercent > 0 ? "+" : ""}${deltaPercent}%)`
            : ""}
        </Badge>
        {#if streakDays >= 2}
          <Badge size="sm" variant="primary">
            🔥 {streakDays}-day streak
          </Badge>
        {/if}
      </div>
    </div>

    <div class="flex shrink-0 flex-wrap items-center gap-3 sm:gap-5">
      <div class="text-primary">
        <Sparkline
          data={dailyCounts}
          width={140}
          height={48}
          showDots
          class="w-[110px] sm:w-[140px]" />
      </div>

      <div class="flex items-center gap-3">
        <svg
          width={ringSize}
          height={ringSize}
          viewBox="0 0 {ringSize} {ringSize}"
          class="-rotate-90"
          role="img"
          aria-label="Chores {choresDone} of {choresTotal}, reminders {remindersDone} of {remindersTotal}">
          <!-- Chores track + progress (outer) -->
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={outerR}
            fill="none"
            stroke="currentColor"
            stroke-width={ringStroke}
            class="text-primary/15"></circle>
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={outerR}
            fill="none"
            stroke="currentColor"
            stroke-width={ringStroke}
            stroke-linecap="round"
            stroke-dasharray={outerCirc}
            stroke-dashoffset={outerCirc * (1 - choresPct)}
            class="text-primary transition-[stroke-dashoffset] duration-500"></circle>

          <!-- Reminders track + progress (inner) -->
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={innerR}
            fill="none"
            stroke="currentColor"
            stroke-width={ringStroke}
            class="text-accent/15"></circle>
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={innerR}
            fill="none"
            stroke="currentColor"
            stroke-width={ringStroke}
            stroke-linecap="round"
            stroke-dasharray={innerCirc}
            stroke-dashoffset={innerCirc * (1 - remindersPct)}
            class="text-accent transition-[stroke-dashoffset] duration-500"></circle>
        </svg>

        <div class="flex flex-col gap-1.5 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="bg-primary inline-block h-2 w-2 rounded-full"></span>
            <span class="text-base-content font-medium tabular-nums">
              {choresDone}/{choresTotal}
            </span>
            <span class="text-muted">chores</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="bg-accent inline-block h-2 w-2 rounded-full"></span>
            <span class="text-base-content font-medium tabular-nums">
              {remindersDone}/{remindersTotal}
            </span>
            <span class="text-muted">reminders</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <WeeklyTimeline {chores} {todos} {reminders} {completionsByDate} />
</Card>
