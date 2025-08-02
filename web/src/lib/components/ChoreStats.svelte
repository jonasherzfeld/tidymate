<script lang="ts">
  import type { PageData } from "../../routes/home/chores/$types";
  import ChoresChart from "$lib/components/ChoresChart.svelte";

  let { data }: { data: PageData } = $props();
</script>

<div
  class="bg-base-100 flex min-h-full w-full flex-1 items-start justify-center">
  <div
    class="mt-5 flex w-full max-w-screen-lg flex-1 flex-col justify-center gap-5 p-4">
    <ChoresChart chores={data.chores} history={data.history} />
  </div>
</div>
