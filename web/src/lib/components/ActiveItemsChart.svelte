<script lang="ts">
  import { PieChart } from "$lib/utils/charts.svelte";

  let {
    todos,
    reminders,
    chores
  }: {
    todos: Todo[];
    reminders: Reminder[];
    chores: Chore[];
  } = $props();

  // Count active (not done) items
  const activeTodos = todos.filter((todo) => !todo.done).length;
  const activeReminders = reminders.filter((reminder) => !reminder.done).length;
  const activeChores = chores.filter((chore) => !chore.done).length;

  // Prepare data for the pie chart
  const itemsData = [
    { type: "Todos", count: activeTodos },
    { type: "Reminders", count: activeReminders },
    { type: "Chores", count: activeChores }
  ];
</script>

<!-- Active Items Statistics Board -->
<div class="card bg-base-200 p-5 shadow">
  <div class="mx-auto w-full max-w-2xl">
    <h2 class="mb-4 text-center text-2xl font-bold">Active Items</h2>
    <div
      use:PieChart={{
        labels: itemsData.map((item) => item.type),
        datasets: [
          {
            label: "Active Items",
            data: itemsData.map((item) => item.count),
            backgroundColor: [
              "rgb(255, 99, 132)", // Todos - Red
              "rgb(54, 162, 235)", // Reminders - Blue
              "rgb(255, 205, 86)" // Chores - Yellow
            ],
            hoverOffset: 4
          }
        ]
      }}
      class="chart-container">
    </div>

    <!-- Item Counts Summary -->
    <div class="mt-6 grid grid-cols-3 gap-4 text-center">
      <div class="bg-base-300 rounded-lg p-4">
        <div class="text-2xl font-bold text-red-500">{activeTodos}</div>
        <div class="text-sm text-gray-600">Active Todos</div>
      </div>
      <div class="bg-base-300 rounded-lg p-4">
        <div class="text-2xl font-bold text-blue-500">
          {activeReminders}
        </div>
        <div class="text-sm text-gray-600">Active Reminders</div>
      </div>
      <div class="bg-base-300 rounded-lg p-4">
        <div class="text-2xl font-bold text-yellow-500">{activeChores}</div>
        <div class="text-sm text-gray-600">Active Chores</div>
      </div>
    </div>
  </div>
</div>
