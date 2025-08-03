<script lang="ts">
  import ItemChart from "$lib/components/items-page/ItemChart.svelte";

  let {
    item_type,
    itemPageState
  }: {
    item_type: string;
    itemPageState: ItemListState<Chore | Reminder | Todo>;
  } = $props();
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <ItemChart {item_type} {itemPageState} />
</div>
