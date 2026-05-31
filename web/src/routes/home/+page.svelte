<script lang="ts">
  import UpNext from "$lib/components/UpNext.svelte";
  import ThisWeekCard from "$lib/components/ThisWeekCard.svelte";
  import type { PageData } from "../$types";

  let { data }: { data: PageData } = $props();

  const thisWeek = $derived(
    data.homeStats?.this_week ?? {
      completed_count: 0,
      prev_week_count: 0,
      daily_counts: Array(14).fill(0) as number[],
      streak_days: 0,
      completions_by_date: {} as Record<string, never[]>
    }
  );

  const greeting = $derived.by(() => {
    const h = new Date().getHours();
    if (h < 5) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  });

  const firstName = $derived(data.user?.first_name ?? "");
</script>

<div class="mx-auto flex w-full max-w-screen-lg flex-1 flex-col gap-6 px-4 py-6">
  <!-- Hero -->
  <header class="flex flex-col gap-1">
    <span class="text-muted text-sm">{greeting}{firstName ? `, ${firstName}` : ""}</span>
    <h1 class="text-base-content text-2xl font-semibold tracking-tight sm:text-3xl">
      Welcome to <span class="text-primary">{data.house.name}</span>
    </h1>
  </header>

  <!-- Up next: the actionable list -->
  <UpNext chores={data.chores} todos={data.todos} reminders={data.reminders} />

  <!-- This week: momentum + day-by-day timeline -->
  <ThisWeekCard
    completedThisWeek={thisWeek.completed_count}
    completedPrevWeek={thisWeek.prev_week_count}
    dailyCounts={thisWeek.daily_counts}
    streakDays={thisWeek.streak_days}
    completionsByDate={thisWeek.completions_by_date}
    chores={data.chores}
    todos={data.todos}
    reminders={data.reminders} />
</div>
