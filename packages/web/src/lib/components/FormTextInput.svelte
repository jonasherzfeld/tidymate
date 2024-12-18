<script lang="ts" context="module">
  type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import {
    formFieldProxy,
    superForm,
    type SuperValidated,
    type FormPathLeaves
  } from "sveltekit-superforms";
  import { EditIcon, SubmitIcon } from "$lib/utils/icons";

  let {
    superform,
    field,
    editValue = $bindable(),
    creatingValue = $bindable(),
    label = "",
    disabled = false
  }: {
    superform: SuperValidated<T>;
    field: FormPathLeaves<T>;
    editValue: boolean;
    creatingValue: boolean;
    label: string;
    disabled?: boolean;
  } = $props();

  const form = superForm(superform);
  const { value, errors, constraints } = formFieldProxy(form, field);

  let changeModeBg = $derived(
    editValue ? "bg-neutral text-base-300" : "bg-base-100"
  );
</script>

<div class="join flex w-full">
  <div
    class={`input input-bordered flex w-full items-center justify-between pl-0 pr-0 ${changeModeBg}`}>
    <span
      class={`label label-text join-item m-2 h-full w-24 text-left ${changeModeBg}`}
      ><b>{label}</b></span>
    {#if editValue}
      <input
        type="text"
        name={field}
        size="1"
        class={`label label-text join-item mr-3 grow text-right ${changeModeBg}`}
        bind:value={$value} />
    {:else}
      <span
        class={`label label-text join-item mr-3 grow justify-end ${changeModeBg}`}
        >{$value}</span>
    {/if}
    {#if editValue}
      <button
        type="submit"
        class="btn join-item btn-secondary input-bordered disabled:bg-base-300 -mr-px h-full"
        disabled={creatingValue}>
        {#if !creatingValue}
          <SubmitIcon style="font-size:1.2em" />
        {:else}
          <span class="loading loading-spinner loading-sm"></span>
        {/if}
      </button>
    {:else}
      <button
        type="button"
        class="btn join-item bg-primary input-bordered -mr-px h-full"
        {disabled}
        onclick={() => {
          editValue = true;
        }}>
        <EditIcon style="font-size:1.2em" />
      </button>
    {/if}
  </div>
</div>
