<script lang="ts">
  import type { PageData } from "./$types";
  import ActiveItemsChart from "$lib/components/ActiveItemsChart.svelte";
  import ChoresChart from "$lib/components/ChoresChart.svelte";
  import RemindersChart from "$lib/components/RemindersChart.svelte";

  let { data }: { data: PageData } = $props();
</script>

<div
  class="bg-base-100 flex min-h-full w-full flex-1 items-start justify-center">
  <div
    class="mt-5 flex w-full max-w-screen-lg flex-1 flex-col justify-center gap-5 p-4">
    <a href="/home/history" class="btn btn-soft btn-sm"> View History </a>

    <ActiveItemsChart
      todos={data.todos}
      reminders={data.reminders}
      chores={data.chores} />

    <ChoresChart chores={data.chores} history={data.history} />

    <RemindersChart reminders={data.reminders} history={data.history} />
  </div>
</div>
