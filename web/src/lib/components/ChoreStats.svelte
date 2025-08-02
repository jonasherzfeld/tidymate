<script lang="ts">
  import type { PageData } from "../../routes/home/chores/$types";
  import ChoresChart from "$lib/components/ChoresChart.svelte";

  let { data }: { data: PageData } = $props();
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <ChoresChart chores={data.chores} history={data.history} />
</div>
