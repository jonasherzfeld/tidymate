<script lang="ts">
  import { ROOM_CONFIG, CATEGORY_CONFIG, type CategoryConfig } from "$lib/utils/constants";
  import { CheckIcon, GeneralIcon } from "$lib/utils/icons";
  import { cn } from "$lib/utils";

  type Kind = "todo" | "chore" | "reminder";

  type CompletedItem = {
    id: string;
    name: string;
    kind: Kind;
    category: string | null;
    completed_at: string;
  };

  type DayItem = {
    key: string; // dedupe key (kind+id+state)
    name: string;
    kind: Kind;
    category?: CategoryConfig;
    done: boolean;
  };

  type DayBucket = {
    date: Date;
    isoDate: string;
    isToday: boolean;
    isPast: boolean;
    items: DayItem[];
  };

  let {
    chores = [],
    todos = [],
    reminders = [],
    completionsByDate = {}
  }: {
    chores?: Chore[];
    todos?: Todo[];
    reminders?: Reminder[];
    completionsByDate?: Record<string, CompletedItem[]>;
  } = $props();

  function startOfWeek(d: Date): Date {
    // Monday as first day of the week.
    const result = new Date(d);
    const day = result.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + offset);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  function isoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function categoryFor(kind: Kind, name: string | null | undefined): CategoryConfig | undefined {
    if (!name) return undefined;
    if (kind === "chore") return ROOM_CONFIG.find((r) => r.name === name);
    if (kind === "reminder") return CATEGORY_CONFIG.find((c) => c.name === name);
    return undefined;
  }

  const today = new Date();
  const weekStart = startOfWeek(today);
  const todayIso = isoDate(today);

  const days: DayBucket[] = $derived.by(() => {
    const buckets: DayBucket[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const iso = isoDate(d);
      buckets.push({
        date: d,
        isoDate: iso,
        isToday: iso === todayIso,
        isPast: iso < todayIso,
        items: []
      });
    }

    const byIso = new Map(buckets.map((b) => [b.isoDate, b]));

    // Completed items from history (authoritative for "done that day").
    // A recurring item completed earlier in the week may also be due again
    // later this week — that's expected, and shows up via pushPlanned below
    // because the backend has already bumped the deadline forward.
    for (const [iso, items] of Object.entries(completionsByDate)) {
      const bucket = byIso.get(iso);
      if (!bucket) continue;
      for (const c of items) {
        bucket.items.push({
          key: `done-${c.kind}-${c.id}-${c.completed_at}`,
          name: c.name,
          kind: c.kind,
          category: categoryFor(c.kind, c.category),
          done: true
        });
      }
    }

    // Planned items: anything with a deadline in this week and not yet checked
    // off. Todos are skipped once done=true; recurring items always have done
    // reset and a fresh deadline, so they can never appear twice on the same day.
    const pushPlanned = (
      id: string,
      kind: Kind,
      name: string,
      deadline: string | undefined,
      done: boolean,
      categoryName?: string | null
    ) => {
      if (done || !deadline) return;
      const iso = deadline.slice(0, 10);
      const bucket = byIso.get(iso);
      if (!bucket) return;
      bucket.items.push({
        key: `plan-${kind}-${id}`,
        name,
        kind,
        category: categoryFor(kind, categoryName),
        done: false
      });
    };

    for (const c of chores) pushPlanned(c.id, "chore", c.data, c.deadline, c.done, c.room);
    for (const r of reminders)
      pushPlanned(r.id, "reminder", r.data, r.deadline, r.done, r.category);
    for (const t of todos) pushPlanned(t.id, "todo", t.data, t.deadline, t.done);

    // Sort each bucket: done first (chronological feel), then planned.
    for (const bucket of buckets) {
      bucket.items.sort((x, y) => Number(y.done) - Number(x.done));
    }
    return buckets;
  });
</script>

<div class="flex flex-col gap-3">
  {#each days as day (day.isoDate)}
    {@const doneCount = day.items.filter((i) => i.done).length}
    {@const plannedCount = day.items.length - doneCount}
    <div
      class={cn(
        "border-neutral rounded-field flex flex-col gap-2 border p-3",
        day.isToday && "border-primary/40 bg-primary/[0.04]"
      )}>
      <div class="flex items-baseline justify-between gap-2">
        <div class="flex items-baseline gap-2">
          <span
            class={cn("text-sm font-medium", day.isToday ? "text-primary" : "text-base-content")}>
            {day.date.toLocaleDateString(undefined, { weekday: "short" })}
            <span class="text-muted text-xs font-normal">
              {day.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </span>
          {#if day.isToday}
            <span class="text-primary text-[10px] font-semibold tracking-wide uppercase">
              Today
            </span>
          {/if}
        </div>
        <div class="text-muted flex items-center gap-2 text-[11px]">
          {#if doneCount > 0}
            <span class="text-success">{doneCount} done</span>
          {/if}
          {#if plannedCount > 0}
            <span>{plannedCount} planned</span>
          {/if}
        </div>
      </div>

      {#if day.items.length === 0}
        <div class="text-muted/70 text-xs italic">
          {day.isPast ? "Nothing logged" : "Nothing planned"}
        </div>
      {:else}
        <div class="flex flex-col gap-1.5">
          {#each day.items as item (item.key)}
            {@const Icon = item.category?.icon ?? GeneralIcon}
            <div
              class={cn(
                "relative flex items-center gap-2 overflow-hidden rounded-md px-2.5 py-1.5 text-xs ring-1 transition-opacity ring-inset",
                item.category?.tint ?? "bg-base-200 text-base-content/80 ring-base-content/10",
                item.done && "opacity-60"
              )}>
              <Icon class="h-3.5 w-3.5 shrink-0" />
              <span class={cn("min-w-0 flex-1 truncate", item.done && "line-through")}>
                {item.name}
              </span>
              {#if item.done}
                <CheckIcon class="h-3 w-3 shrink-0" />
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>
