<script lang="ts">
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import type { PageData } from "../$types";

  let { data }: { data: PageData } = $props();

  // Get all data including reminders for personal stats
  const householdData: {
    chores: Chore[];
    todos: Todo[];
    reminders: Reminder[];
    members: User[];
  } = $derived({
    chores: data.chores || [],
    todos: data.todos || [],
    reminders: data.reminders || [],
    members: data.house?.members || []
  });

  // Calculate active items (items that are not yet done)
  const activeChores: number = $derived(
    householdData.chores.filter((chore) => !chore.done).length
  );
  const activeTodos: number = $derived(
    householdData.todos.filter((todo) => !todo.done).length
  );
  const activeReminders: number = $derived(
    householdData.reminders.filter((reminder) => !reminder.done).length
  );

  // Get completion stats from history data (household stats - no reminders)
  const completionStats: {
    total_completed: number;
    completed_todos: number;
    completed_chores: number;
    by_user: Record<string, any>;
  } = $derived(
    data.completionStats || {
      total_completed: 0,
      completed_todos: 0,
      completed_chores: 0,
      by_user: {}
    }
  );

  // Get personal stats including reminders
  const personalStats = $derived(
    data.personalStats || {
      total_completed: 0,
      completed_todos: 0,
      completed_chores: 0,
      completed_reminders: 0
    }
  );

  // Use completion stats from history for household completed counts
  const completedChores = $derived(completionStats.completed_chores);
  const completedTodos = $derived(completionStats.completed_todos);
  const completedReminders = $derived(personalStats.completed_reminders);

  // Create leaderboard based on completion history (household tasks only)
  const leaderboard = $derived(
    householdData.members
      .map((member) => {
        const userStats = completionStats.by_user[member.id] || {
          total: 0,
          todos: 0,
          chores: 0
        };

        return {
          ...member,
          totalCompleted: userStats.total,
          completedChores: userStats.chores,
          completedTodos: userStats.todos
        };
      })
      .sort((a, b) => b.totalCompleted - a.totalCompleted)
  );

  // Current user stats for household tasks
  const currentUserStats = $derived(
    leaderboard.find((member) => member.id === data.user?.id)
  );
  const totalActiveHousehold = $derived(activeChores + activeTodos);
  const totalCompletedHousehold = $derived(completionStats.total_completed);
  const userCompletionRate = $derived(
    currentUserStats && totalCompletedHousehold > 0
      ? Math.round(
          (currentUserStats.totalCompleted / totalCompletedHousehold) * 100
        )
      : 0
  );

  // Personal stats including reminders
  const totalActivePersonal = $derived(
    activeChores + activeTodos + activeReminders
  );
  const totalCompletedPersonal = $derived(personalStats.total_completed);
</script>

<div
  class="bg-base-100 flex min-h-full w-full flex-1 items-start justify-center">
  <div
    class="mt-5 flex w-full max-w-screen-lg flex-1 flex-col justify-center gap-5 p-4">
    <h1 class="text-accent text-center text-5xl font-bold">
      {data.house.name}
    </h1>

    <!-- Personal Statistics Board -->
    <div class="card bg-base-200">
      <div
        class="card-body tab-content bg-base-100 border-base-300 rounded-box p-2">
        <div class="flex items-center justify-between">
          <h2 class="card-title justify-center text-center">
            Your Personal Stats
          </h2>
        </div>
        <div
          class="stats stats-vertical bg-base-300 md:stats-horizontal shadow">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <div class="stat-title">Your Active Tasks</div>
            <div class="stat-value text-primary">{totalActivePersonal}</div>
            <div class="stat-desc">
              {activeChores} chores • {activeTodos} todos • {activeReminders} reminders
            </div>
          </div>

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
            <div class="stat-title">Your Completed Tasks</div>
            <div class="stat-value text-success">{totalCompletedPersonal}</div>
            <div class="stat-desc">
              {personalStats.completed_chores} chores • {personalStats.completed_todos}
              todos • {completedReminders} reminders
            </div>
          </div>

          <div class="stat">
            <div class="stat-figure text-secondary">
              <div class="avatar online">
                <AvatarGraphic
                  thumbnail={data.user?.thumbnail}
                  height="h-16"
                  width="w-16"
                  textSize="text-lg" />
              </div>
            </div>
            <div class="stat-value">{userCompletionRate}%</div>
            <div class="stat-title">Household contribution</div>
            <div class="stat-desc text-secondary">
              {currentUserStats?.totalCompleted || 0} household tasks completed
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Household Statistics Board -->
    <div class="card bg-base-200">
      <div
        class="card-body tab-content bg-base-100 border-base-300 rounded-box p-2">
        <h2 class="card-title justify-start text-center">Household Stats</h2>
        <div
          class="stats stats-vertical bg-base-300 md:stats-horizontal shadow">
          <div class="stat">
            <div class="stat-figure text-warning">
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
            <div class="stat-title">Household Active</div>
            <div class="stat-value text-warning">{totalActiveHousehold}</div>
            <div class="stat-desc">
              {activeChores} chores • {activeTodos} todos
            </div>
          </div>

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
            <div class="stat-title">Household Completed</div>
            <div class="stat-value text-success">{totalCompletedHousehold}</div>
            <div class="stat-desc">
              {completedChores} chores • {completedTodos} todos
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <div class="stat-title">Team Members</div>
            <div class="stat-value text-info">
              {householdData.members.length}
            </div>
            <div class="stat-desc">household members</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Leaderboard -->
    <div class="card bg-base-300">
      <div
        class="card-body tab-content bg-base-100 border-base-300 rounded-box p-2">
        <h2 class="card-title justify-start text-center">
          Household Leaderboard
        </h2>
        <div class="space-y-3">
          {#each leaderboard as member, index}
            <div
              class="card bg-base-300 shadow-sm {member.id === data.user?.id
                ? 'ring-primary ring-2'
                : ''}">
              <div class="card-body p-2">
                <div class="flex items-center justify-between">
                  <!-- Left side: Rank and Member info -->
                  <div class="flex items-center gap-4">
                    <!-- Rank -->
                    <div class="flex-shrink-0">
                      {#if index === 0}
                        <span class="text-3xl">🥇</span>
                      {:else if index === 1}
                        <span class="text-3xl">🥈</span>
                      {:else if index === 2}
                        <span class="text-3xl">🥉</span>
                      {:else}
                        <div
                          class="bg-base-200 flex h-12 w-12 items-center justify-center rounded-full">
                          <span class="text-lg font-bold">#{index + 1}</span>
                        </div>
                      {/if}
                    </div>

                    <!-- Member info -->
                    <div class="flex items-center gap-3">
                      <AvatarGraphic
                        thumbnail={member.thumbnail}
                        height="h-12"
                        width="w-12"
                        textSize="text-sm" />
                      <div>
                        <div class="font-bold">
                          {member.first_name}
                          {member.last_name}
                        </div>
                        {#if member.id === data.user?.id}
                          <div class="text-sm opacity-50">(You)</div>
                        {/if}
                      </div>
                    </div>
                  </div>

                  <!-- Right side: Stats -->
                  <div
                    class="flex min-w-24 flex-col items-end justify-end gap-2 sm:flex-row">
                    <div class="badge badge-primary badge-lg font-bold">
                      {member.totalCompleted}
                    </div>
                    <div class="badge badge-ghost">
                      {member.completedChores} chores
                    </div>
                    <div class="badge badge-ghost">
                      {member.completedTodos} todos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
