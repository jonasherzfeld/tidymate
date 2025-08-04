<script lang="ts">
  import { BarChart } from "$lib/utils/charts.svelte";
  import {
    ROOM_CONFIG,
    CATEGORY_CONFIG,
    type CategoryConfig
  } from "$lib/utils/constants";

  type T = Chore | Reminder | Todo;
  let {
    item_type,
    itemPageState
  }: { item_type: string; itemPageState: ItemListState<T> } = $props();

  // Reactive chart data - automatically updates when itemPageState changes
  const chartData = $derived.by(() => {
    const items = itemPageState.items;
    const history = itemPageState.history;

    // Generate last 12 months (including current)
    const months = generateLast12Months();

    // Create item ID -> category mapping
    const itemCategoryMap = createItemCategoryMap(items);

    // Filter completed chores from last 12 months
    const completedItems = getCompletedItemsInRange(history, months[0].date);

    // Get all unique rooms
    const categories = getAllCategories(items, completedItems, itemCategoryMap);

    // Count completions by month and room
    const monthlyData = countCompletionsByMonthAndCategory(
      completedItems,
      itemCategoryMap,
      months
    );

    return {
      labels: months.map((m) => m.label),
      datasets: createCategoryDatasets(categories, monthlyData, months)
    };
  });

  // Helper functions
  function generateLast12Months() {
    const now = new Date();
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      });

      months.push({ date, monthKey, label });
    }

    return months;
  }

  function createItemCategoryMap(items: T[]) {
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (item_type === "chore") {
        map.set(item.id, item.room || "General");
      } else if (item_type === "reminder") {
        map.set(item.id, item.category || "General");
      }
    });
    return map;
  }

  function getCompletedItemsInRange(history: History[], startDate: Date) {
    return history.filter(
      (item) =>
        item.event_type === "completed" &&
        item.item_type === item_type &&
        new Date(item.created_on) >= startDate
    );
  }

  function getAllCategories(
    items: T[],
    completedItems: any[],
    itemCategoryMap: Map<string, string>
  ) {
    const categories = new Set<string>();

    // Add rooms from current chores
    items.forEach((item) => {
      if (item_type === "chore") {
        categories.add(item.room || "General");
      } else if (item_type === "reminder") {
        categories.add(item.category || "General");
      }
    });

    // Add rooms from completed chores
    completedItems.forEach((item) => {
      const category = itemCategoryMap.get(item.item_id) || "General";
      categories.add(category);
    });

    return Array.from(categories).sort();
  }

  function countCompletionsByMonthAndCategory(
    completedItems: any[],
    itemCategoryMap: Map<string, string>,
    months: any[]
  ) {
    const data = new Map<string, Map<string, number>>();

    // Initialize all months with 0 counts
    months.forEach((month) => {
      data.set(month.monthKey, new Map());
    });

    // Count completions
    completedItems.forEach((chore) => {
      const date = new Date(chore.created_on);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const category = itemCategoryMap.get(chore.item_id) || "General";

      if (data.has(monthKey)) {
        const categoryMap = data.get(monthKey)!;
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      }
    });

    return data;
  }

  function createCategoryDatasets(
    categories: string[],
    monthlyData: Map<string, Map<string, number>>,
    months: any[]
  ) {
    let categoryMap = new Map<string, CategoryConfig>();
    if (item_type === "chore") {
      categoryMap = new Map(ROOM_CONFIG.map((room) => [room.name, room]));
    } else if (item_type === "reminder") {
      categoryMap = new Map(
        CATEGORY_CONFIG.map((category) => [category.name, category])
      );
    }

    return categories.map((category) => {
      const config = categoryMap.get(category);
      const backgroundColor = config?.rgba_color || "rgba(0, 0, 0, 0.6)"; // Default to black if not found
      const borderColor = backgroundColor.replace("0.6", "1");

      return {
        label: category,
        data: months.map(
          (month) => monthlyData.get(month.monthKey)?.get(category) || 0
        ),
        backgroundColor,
        borderColor,
        borderWidth: 1
      };
    });
  }
  let datasets = $derived(chartData.datasets);
  let labels = $derived(chartData.labels);

  const isDataReady = $derived(
    chartData.datasets.length > 0 &&
      chartData.labels.length > 0 &&
      itemPageState.items.length > 0
  );
</script>

<!-- Completed Chores per Month Chart -->
<div class="card p-5 shadow">
  <div class="mx-auto w-full max-w-4xl">
    <div class="mb-4 flex flex-col items-center">
      <h2 class="text-center text-2xl font-bold">
        Completed {item_type === "chore" ? "Chores" : "Reminders"}
      </h2>
      <span class="text-center text-sm"
        >Last 12 Months per {item_type === "chore" ? "Room" : "Category"}</span>
    </div>
    {#if isDataReady}
      <div
        use:BarChart={{
          labels: labels,
          datasets: datasets,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top" as const
              },
              title: {
                display: false
              }
            },
            scales: {
              x: { stacked: true },
              y: { stacked: true, beginAtZero: true }
            }
          }
        }}
        class="chart-container h-72">
      </div>
    {:else}
      <div class="chart-container flex h-72 items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {/if}
  </div>
</div>
