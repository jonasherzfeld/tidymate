<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    type = "text",
    name,
    placeholder = "",
    classIn = "",
    value = $bindable(),
    disabled = false,
    children
  }: {
    type?: string;
    name: string;
    placeholder?: string;
    classIn?: string;
    value?: string | number;
    disabled?: boolean;
    children?: Snippet;
  } = $props();
</script>

<label class={"input input-bordered flex w-full items-center gap-1 " + classIn}>
  {@render children?.()}
  <input
    {type}
    {name}
    class="grow text-right"
    {placeholder}
    {value}
    {disabled} />
</label>
