<script lang="ts">
  import { BarChart } from "$lib/utils/charts.svelte";

  let {
    todos,
    history
  }: {
    todos: Todo[];
    history: History[];
  } = $props();

  // Prepare data for closed todos bar chart (last 12 months including current)
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1); // Start from 11 months ago to include current month

  // Filter completed todos from history in the last year including current month
  const completedTodos = history.filter(
    (historyItem) =>
      historyItem.event_type === "completed" &&
      historyItem.item_type === "todo" &&
      new Date(historyItem.created_on) >= oneYearAgo
  );

  // Group by month
  const monthlyTodoData = new Map<string, number>();

  // Initialize last 12 months (including current month) with 0 counts for each category
  for (let i = 0; i <= 11; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // Use local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so add 1
    const monthKey = `${year}-${month}`; // YYYY-MM format
    monthlyTodoData.set(monthKey, 0);
  }

  // Count completed todos by month
  completedTodos.forEach((todo) => {
    const date = new Date(todo.created_on);
    // Use local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so add 1
    const monthKey = `${year}-${month}`; // YYYY-MM format

    if (monthlyTodoData.has(monthKey)) {
      monthlyTodoData.set(monthKey, monthlyTodoData.get(monthKey)! + 1);
    }
  });

  // Convert to chart data format (sort months chronologically)
  const sortedMonthKeys = Array.from(monthlyTodoData.keys()).sort();
  const chartLabels = sortedMonthKeys.map((monthKey) => {
    const date = new Date(monthKey + "-01");
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  });

  // Create datasets for each category
  const todoDatasets = {
    label: "Todos Completed",
    data: sortedMonthKeys.map((monthKey) => monthlyTodoData.get(monthKey) || 0),
    backgroundColor: "rgba(16, 185, 129, 0.6)",
    borderColor: "rgba(16, 185, 129, 1)",
    borderWidth: 1
  };
</script>

<!-- Completed Todos per Month Chart -->
<div class="card bg-base-200 p-5 shadow">
  <div class="mx-auto w-full max-w-4xl">
    <div class="mb-4 flex flex-col items-center">
      <h2 class="text-center text-2xl font-bold">Completed Todos</h2>
      <span class="text-center text-sm"> Last 12 Months </span>
    </div>

    <div
      use:BarChart={{
        labels: chartLabels,
        datasets: [todoDatasets],
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const
            },
            title: {
              display: false
            }
          },
          scales: {
            x: {
              stacked: true
            },
            y: {
              stacked: true,
              beginAtZero: true
            }
          }
        }
      }}
      class="chart-container">
    </div>
  </div>
</div>
