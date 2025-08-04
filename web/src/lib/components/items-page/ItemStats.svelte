<script lang="ts">
  import ItemChart from "$lib/components/items-page/ItemChart.svelte";
  import ItemTotalChart from "$lib/components/items-page/ItemTotalChart.svelte";

  let {
    item_type,
    itemPageState
  }: {
    item_type: string;
    itemPageState: ItemListState<Chore | Reminder | Todo>;
  } = $props();
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  {#if item_type === "todo"}
    <ItemTotalChart {item_type} {itemPageState} />
  {:else}
    <ItemChart {item_type} {itemPageState} />
  {/if}
</div>
