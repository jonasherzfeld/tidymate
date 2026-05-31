<script lang="ts">
  import { BarChart } from "$lib/utils/charts.svelte";
  import { Card, SectionHeader } from "$lib/components/ui";

  type T = Chore | Reminder | Todo;
  let { item_type, itemPageState }: { item_type: string; itemPageState: ItemListState<T> } =
    $props();

  // Reactive chart data - automatically updates when itemPageState changes
  const chartData = $derived.by(() => {
    const history = itemPageState.history;

    // Generate last 12 months (including current)
    const months = generateLast12Months();

    // Filter completed items from last 12 months
    const completedItems = getCompletedItemsInRange(history, months[0].date);

    // Count completions by month
    const monthlyData = countCompletionsByMonth(completedItems, months);

    return {
      labels: months.map((m) => m.label),
      datasets: createTotalDataset(monthlyData, months)
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

  function getCompletedItemsInRange(history: History[], startDate: Date) {
    return history.filter(
      (event) =>
        event.event_type === "completed" &&
        event.item_type === item_type &&
        new Date(event.created_on) >= startDate
    );
  }

  function countCompletionsByMonth(completedItems: any[], months: any[]) {
    const data = new Map<string, number>();

    // Initialize all months with 0 counts
    months.forEach((month) => {
      data.set(month.monthKey, 0);
    });

    // Count completions
    completedItems.forEach((event) => {
      const date = new Date(event.created_on);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (data.has(monthKey)) {
        data.set(monthKey, (data.get(monthKey) || 0) + 1);
      }
    });

    return data;
  }

  function createTotalDataset(monthlyData: Map<string, number>, months: any[]) {
    const backgroundColor = "rgba(54, 162, 235, 0.6)";
    const borderColor = "rgba(54, 162, 235, 1)";

    return [
      {
        label: `Total Completed`,
        data: months.map((month) => monthlyData.get(month.monthKey) || 0),
        backgroundColor,
        borderColor,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false
      }
    ];
  }
  let datasets = $derived(chartData.datasets);
  let labels = $derived(chartData.labels);
</script>

<Card padding="md">
  <SectionHeader
    title={`Completed ${item_type}s`}
    subtitle="Last 12 months." />

  <div
    use:BarChart={{
      labels: labels,
      datasets: datasets,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: false }
        },
        scales: {
          x: { stacked: false },
          y: { stacked: false, beginAtZero: true }
        }
      }
    }}
    class="chart-container mt-4 h-72">
  </div>
</Card>
