<script lang="ts">
  import TodoChart from "$lib/components/TodoChart.svelte";

  export let data: { todos: Todo[]; history: History[] };
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <TodoChart todos={data.todos} history={data.history} />
</div>
