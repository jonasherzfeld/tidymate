<script lang="ts">
  import RemindersChart from "$lib/components/RemindersChart.svelte";

  export let data: { reminders: Reminder[]; history: History[] };
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <RemindersChart reminders={data.reminders} history={data.history} />
</div>
