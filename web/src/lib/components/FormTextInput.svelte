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

<div class="flex flex-col">
  <span class="label mb-1 h-full text-left text-sm">{label}</span>
  <div class="join w-full">
    <input
      type="text"
      name={field}
      size="1"
      class="input join-item label-text disabled:border-[1px]5 grow text-right disabled:border-neutral-500"
      disabled={!editValue}
      bind:value={$value} />
    {#if editValue}
      <button
        type="submit"
        class="btn btn-secondary join-item disabled:bg-base-300 border-neutral-500"
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
        class="btn join-item bg-primary border-neutral-500"
        {disabled}
        onclick={() => {
          editValue = true;
        }}>
        <EditIcon style="font-size:1.2em" />
      </button>
    {/if}
  </div>
</div>
