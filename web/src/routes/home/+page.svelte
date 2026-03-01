<script lang="ts">
  import { BarChart } from "$lib/utils/charts.svelte";
  import {
    ROOM_CONFIG,
    CATEGORY_CONFIG,
    type CategoryConfig
  } from "$lib/utils/constants";
  import type { PageData } from "../$types";

  let { data }: { data: PageData } = $props();

  const activeChores: number = $derived(
    (data.chores || []).filter((chore: Chore) => !chore.done).length
  );
  const activeTodos: number = $derived(
    (data.todos || []).filter((todo: Todo) => !todo.done).length
  );
  const activeReminders: number = $derived(
    (data.reminders || []).filter((reminder: Reminder) => !reminder.done).length
  );

  const household = $derived(
    data.homeStats?.household ?? {
      total_completed: 0,
      last_month_completed: 0,
      completed_chores: 0,
      completed_todos: 0,
      last_month_chores: 0,
      last_month_todos: 0,
      strongest_room: null,
      strongest_room_count: 0,
      room_breakdown: {}
    }
  );

  const reminderStats = $derived(
    data.homeStats?.reminders ?? {
      total_completed: 0,
      last_month_completed: 0,
      strongest_category: null,
      strongest_category_count: 0,
      category_breakdown: {}
    }
  );

  // Room chart data
  const roomChartData = $derived.by(() => {
    const breakdown: Record<string, number> = household.room_breakdown || {};
    const roomColorMap = new Map<string, CategoryConfig>(
      ROOM_CONFIG.map((r) => [r.name, r])
    );

    const entries = Object.entries(breakdown).sort(([, a], [, b]) => b - a);
    const labels = entries.map(([name]) => name);
    const values = entries.map(([, count]) => count);
    const bgColors = labels.map(
      (name) => roomColorMap.get(name)?.rgba_color || "rgba(120, 113, 108, 0.6)"
    );
    const borderColors = bgColors.map((c) => c.replace("0.6", "1"));

    return {
      labels,
      datasets: [
        {
          label: "Completed",
          data: values,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1
        }
      ]
    };
  });

  // Category chart data
  const categoryChartData = $derived.by(() => {
    const breakdown: Record<string, number> =
      reminderStats.category_breakdown || {};
    const catColorMap = new Map<string, CategoryConfig>(
      CATEGORY_CONFIG.map((c) => [c.name, c])
    );

    const entries = Object.entries(breakdown).sort(([, a], [, b]) => b - a);
    const labels = entries.map(([name]) => name);
    const values = entries.map(([, count]) => count);
    const bgColors = labels.map(
      (name) => catColorMap.get(name)?.rgba_color || "rgba(120, 113, 108, 0.6)"
    );
    const borderColors = bgColors.map((c) => c.replace("0.6", "1"));

    return {
      labels,
      datasets: [
        {
          label: "Completed",
          data: values,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1
        }
      ]
    };
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };
</script>

<div
  class="bg-base-100 flex min-h-full w-full flex-1 items-start justify-center">
  <div
    class="mt-5 flex w-full max-w-screen-lg flex-1 flex-col justify-center gap-5 p-4">
    <h1 class="text-accent text-center text-5xl font-bold">
      {data.house.name}
    </h1>

    <!-- Household Achievements (Chores + Todos) -->
    <div class="card bg-base-200">
      <div
        class="card-body tab-content bg-base-100 border-base-300 rounded-box p-2">
        <h2 class="card-title justify-start text-center">
          Household Achievements
        </h2>
        <div
          class="stats stats-vertical bg-base-300 md:stats-horizontal shadow">
          <div class="stat">
            <div class="stat-figure text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-8 w-8 stroke-current">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Total Completed</div>
            <div class="stat-value text-success">
              {household.total_completed}
            </div>
            <div class="stat-desc">
              {household.completed_chores} chores • {household.completed_todos} todos
            </div>
          </div>

          <div class="stat">
            <div class="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-8 w-8 stroke-current">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Last 30 Days</div>
            <div class="stat-value text-primary">
              {household.last_month_completed}
            </div>
            <div class="stat-desc">
              {household.last_month_chores} chores • {household.last_month_todos}
              todos
            </div>
          </div>

          <div class="stat">
            <div class="stat-figure text-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-8 w-8 stroke-current">
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 16v-3m0 0v-3m0 3H9m3 0h3M4 16.8v-5.348c0-.534 0-.801.065-1.05c.058-.22.152-.429.28-.617c.145-.213.346-.39.748-.741l4.801-4.202c.746-.652 1.119-.978 1.538-1.102c.37-.11.765-.11 1.135 0c.42.124.794.45 1.54 1.104l4.8 4.2c.403.352.603.528.748.74a2 2 0 0 1 .28.618c.065.248.065.516.065 1.05v5.352c0 1.118 0 1.677-.218 2.105a2 2 0 0 1-.874.873c-.428.218-.986.218-2.104.218H7.197c-1.118 0-1.678 0-2.105-.218a2 2 0 0 1-.874-.873C4 18.48 4 17.92 4 16.8"
                ></path>
              </svg>
            </div>
            <div class="stat-title">Strongest Room</div>
            {#if household.strongest_room}
              <div class="stat-value text-info text-2xl">
                {household.strongest_room}
              </div>
              <div class="stat-desc">
                {household.strongest_room_count} chores completed
              </div>
            {:else}
              <div class="stat-value text-base-content/30 text-lg">
                No data yet
              </div>
              <div class="stat-desc">Complete chores to see stats</div>
            {/if}
          </div>
        </div>

        {#if roomChartData.labels.length > 0}
          <div class="mt-2">
            <h3 class="mb-2 px-2 text-sm font-medium">Completed by Room</h3>
            <div
              use:BarChart={{ ...roomChartData, options: chartOptions }}
              class="chart-container h-48">
            </div>
          </div>
        {/if}

        <div class="stat-desc px-2 pt-1">
          {activeChores + activeTodos} active tasks ({activeChores} chores • {activeTodos}
          todos)
        </div>
      </div>
    </div>

    <!-- Your Reminders -->
    <div class="card bg-base-200">
      <div
        class="card-body tab-content bg-base-100 border-base-300 rounded-box p-2">
        <h2 class="card-title justify-start text-center">Your Reminders</h2>
        <div
          class="stats stats-vertical bg-base-300 md:stats-horizontal shadow">
          <div class="stat">
            <div class="stat-figure text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-8 w-8 stroke-current">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Total Completed</div>
            <div class="stat-value text-success">
              {reminderStats.total_completed}
            </div>
            <div class="stat-desc">reminders completed</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-8 w-8 stroke-current">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">Last 30 Days</div>
            <div class="stat-value text-primary">
              {reminderStats.last_month_completed}
            </div>
            <div class="stat-desc">reminders completed</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-8 w-8 stroke-current">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                ></path>
              </svg>
            </div>
            <div class="stat-title">Strongest Category</div>
            {#if reminderStats.strongest_category}
              <div class="stat-value text-info text-2xl">
                {reminderStats.strongest_category}
              </div>
              <div class="stat-desc">
                {reminderStats.strongest_category_count} reminders completed
              </div>
            {:else}
              <div class="stat-value text-base-content/30 text-lg">
                No data yet
              </div>
              <div class="stat-desc">Complete reminders to see stats</div>
            {/if}
          </div>
        </div>

        {#if categoryChartData.labels.length > 0}
          <div class="mt-2">
            <h3 class="mb-2 px-2 text-sm font-medium">Completed by Category</h3>
            <div
              use:BarChart={{ ...categoryChartData, options: chartOptions }}
              class="chart-container h-48">
            </div>
          </div>
        {/if}

        <div class="stat-desc px-2 pt-1">
          {activeReminders} active reminders
        </div>
      </div>
    </div>
  </div>
</div>
