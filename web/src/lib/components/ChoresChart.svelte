<script lang="ts">
  import { BarChart } from "$lib/utils/charts.svelte";

  let {
    chores,
    history
  }: {
    chores: Chore[];
    history: History[];
  } = $props();

  // Prepare data for closed chores bar chart (last 12 months including current)
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1); // Start from 11 months ago to include current month

  // Filter completed chores from history in the last year including current month
  const completedChores = history.filter(
    (historyItem) =>
      historyItem.event_type === "completed" &&
      historyItem.item_type === "chore" &&
      new Date(historyItem.created_on) >= oneYearAgo
  );

  // Create a map of chore ID to room for current chores
  const choreRoomMap = new Map<string, string>();
  chores.forEach((chore) => {
    choreRoomMap.set(chore.id, chore.room || "General");
  });

  // Get unique rooms from completed chores and current chores
  const completedChoreRooms = new Set<string>();
  completedChores.forEach((chore) => {
    const room = choreRoomMap.get(chore.item_id) || "General";
    completedChoreRooms.add(room);
  });

  // Also include rooms from current chores to have consistent room list
  chores.forEach((chore) => {
    completedChoreRooms.add(chore.room || "General");
  });

  const rooms = Array.from(completedChoreRooms).sort();

  // Group by month and room
  const monthlyRoomData = new Map<string, Map<string, number>>();

  // Initialize last 12 months (including current month) with 0 counts for each room
  for (let i = 0; i <= 11; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // Use local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so add 1
    const monthKey = `${year}-${month}`; // YYYY-MM format
    const roomMap = new Map<string, number>();
    rooms.forEach((room) => roomMap.set(room, 0));
    monthlyRoomData.set(monthKey, roomMap);
  }

  // Count completed chores by month and room
  completedChores.forEach((chore) => {
    const date = new Date(chore.created_on);
    // Use local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so add 1
    const monthKey = `${year}-${month}`; // YYYY-MM format
    const room = choreRoomMap.get(chore.item_id) || "General";

    if (monthlyRoomData.has(monthKey)) {
      const roomMap = monthlyRoomData.get(monthKey)!;
      roomMap.set(room, (roomMap.get(room) || 0) + 1);
    }
  });

  // Convert to chart data format (sort months chronologically)
  const sortedMonthKeys = Array.from(monthlyRoomData.keys()).sort();
  const chartLabels = sortedMonthKeys.map((monthKey) => {
    const date = new Date(monthKey + "-01");
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  });

  // Create datasets for each room
  const roomDatasets = rooms.map((room, index) => {
    // Create a color palette for the charts
    const chartColors = [
      "rgba(120, 113, 108, 0.6)", // stone-500
      "rgba(59, 130, 246, 0.6)", // blue-500
      "rgba(251, 191, 36, 0.6)", // amber-400
      "rgba(139, 92, 246, 0.6)", // violet-500
      "rgba(163, 230, 53, 0.6)", // lime-400
      "rgba(251, 113, 133, 0.6)", // rose-400
      "rgba(67, 56, 202, 0.6)", // indigo-700
      "rgba(34, 197, 94, 0.6)" // primary/green
    ];

    const borderColors = [
      "rgba(120, 113, 108, 1)",
      "rgba(59, 130, 246, 1)",
      "rgba(251, 191, 36, 1)",
      "rgba(139, 92, 246, 1)",
      "rgba(163, 230, 53, 1)",
      "rgba(251, 113, 133, 1)",
      "rgba(67, 56, 202, 1)",
      "rgba(34, 197, 94, 1)"
    ];

    // Map room names to specific colors or use index-based fallback
    const roomColorMap: { [key: string]: number } = {
      General: 0,
      Bathroom: 1,
      Bedroom: 2,
      Kitchen: 3,
      "Living Room": 4,
      Office: 5,
      Outdoor: 6,
      House: 7
    };

    const colorIndex = roomColorMap[room] ?? index % chartColors.length;
    const backgroundColor = chartColors[colorIndex];
    const borderColor = borderColors[colorIndex];

    return {
      label: room,
      data: sortedMonthKeys.map(
        (monthKey) => monthlyRoomData.get(monthKey)?.get(room) || 0
      ),
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1
    };
  });
</script>

<!-- Completed Chores per Month Chart -->
<div class="card bg-base-200 p-5 shadow">
  <div class="mx-auto w-full max-w-4xl">
    <div class="mb-4 flex flex-col items-center">
      <h2 class="text-center text-2xl font-bold">Completed Chores</h2>
      <span class="text-center text-sm"> Last 12 Months per Room </span>
    </div>

    <div
      use:BarChart={{
        type: "bar",
        labels: chartLabels,
        datasets: roomDatasets,
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
