<script lang="ts">
  import { BarChart } from "$lib/utils/charts.svelte";

  let {
    reminders,
    history
  }: {
    reminders: Reminder[];
    history: History[];
  } = $props();

  // Prepare data for closed reminders bar chart (last 12 months including current)
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1); // Start from 11 months ago to include current month

  // Filter completed reminders from history in the last year including current month
  const completedReminders: History[] = history.filter(
    (historyItem) =>
      historyItem.event_type === "completed" &&
      historyItem.item_type === "reminder" &&
      new Date(historyItem.created_on) >= oneYearAgo
  );

  // Create a map of reminder ID to category for current reminders
  const reminderCategoryMap = new Map<string, string>();
  reminders.forEach((reminder) => {
    reminderCategoryMap.set(reminder.id, reminder.category || "General");
  });

  // Get unique categories from completed reminders and current reminders
  const completedReminderCategories = new Set<string>();
  completedReminders.forEach((event: History) => {
    if (!event.item) return;
    const category = reminderCategoryMap.get(event.item.id) || "General";
    completedReminderCategories.add(category);
  });

  // Also include categories from current reminders to have consistent category list
  reminders.forEach((reminder) => {
    completedReminderCategories.add(reminder.category || "General");
  });

  const categories = Array.from(completedReminderCategories).sort();

  // Group by month and category
  const monthlyCategoryData = new Map<string, Map<string, number>>();

  // Initialize last 12 months (including current month) with 0 counts for each category
  for (let i = 0; i <= 11; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // Use local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so add 1
    const monthKey = `${year}-${month}`; // YYYY-MM format
    const categoryMap = new Map<string, number>();
    categories.forEach((category) => categoryMap.set(category, 0));
    monthlyCategoryData.set(monthKey, categoryMap);
  }

  // Count completed reminders by month and category
  completedReminders.forEach((event: History) => {
    if (!event.item) return;
    const date = new Date(event.created_on);
    // Use local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so add 1
    const monthKey = `${year}-${month}`; // YYYY-MM format
    const category = reminderCategoryMap.get(event.item.id) || "General";

    if (monthlyCategoryData.has(monthKey)) {
      const categoryMap = monthlyCategoryData.get(monthKey)!;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    }
  });

  // Convert to chart data format (sort months chronologically)
  const sortedMonthKeys = Array.from(monthlyCategoryData.keys()).sort();
  const chartLabels = sortedMonthKeys.map((monthKey) => {
    const date = new Date(monthKey + "-01");
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  });

  // Create datasets for each category
  const categoryDatasets = categories.map((category, index) => {
    // Create a color palette for the charts (different from rooms)
    const chartColors = [
      "rgba(120, 113, 108, 0.6)", // stone-500 - General
      "rgba(16, 185, 129, 0.6)", // emerald-500 - Work
      "rgba(245, 158, 11, 0.6)", // amber-500 - Personal
      "rgba(168, 85, 247, 0.6)", // purple-500 - Health
      "rgba(239, 68, 68, 0.6)", // red-500 - Important
      "rgba(59, 130, 246, 0.6)", // blue-500 - Finance
      "rgba(34, 197, 94, 0.6)", // green-500 - Shopping
      "rgba(249, 115, 22, 0.6)" // orange-500 - Other
    ];

    const borderColors = [
      "rgba(120, 113, 108, 1)",
      "rgba(16, 185, 129, 1)",
      "rgba(245, 158, 11, 1)",
      "rgba(168, 85, 247, 1)",
      "rgba(239, 68, 68, 1)",
      "rgba(59, 130, 246, 1)",
      "rgba(34, 197, 94, 1)",
      "rgba(249, 115, 22, 1)"
    ];

    // Map category names to specific colors or use index-based fallback
    const categoryColorMap: { [key: string]: number } = {
      General: 0,
      Work: 1,
      Personal: 2,
      Health: 3,
      Important: 4,
      Finance: 5,
      Shopping: 6
    };

    const colorIndex = categoryColorMap[category] ?? index % chartColors.length;
    const backgroundColor = chartColors[colorIndex];
    const borderColor = borderColors[colorIndex];

    return {
      label: category,
      data: sortedMonthKeys.map(
        (monthKey) => monthlyCategoryData.get(monthKey)?.get(category) || 0
      ),
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1
    };
  });
</script>

<!-- Completed Reminders per Month Chart -->
<div class="card bg-base-200 p-5 shadow">
  <div class="mx-auto w-full max-w-4xl">
    <div class="mb-4 flex flex-col items-center">
      <h2 class="text-center text-2xl font-bold">Completed Reminders</h2>
      <span class="text-center text-sm"> Last 12 Months per Category </span>
    </div>

    <div
      use:BarChart={{
        labels: chartLabels,
        datasets: categoryDatasets,
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
      class="chart-container h-72">
    </div>
  </div>
</div>
