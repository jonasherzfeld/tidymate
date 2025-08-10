<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { page } from "$app/stores";
  import { copy } from "svelte-copy";

  let creatingJoinId = $state(false);
  let joinIdValue = $state($page.data.house.join_id);
  let isActiveJoinId = $derived(joinIdValue);

  let { serverErrors = $bindable() }: { serverErrors: string } = $props();

  const { enhance: joinidEnhance } = superForm($page.data.joinIdForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => {
      creatingJoinId = true;
    },
    onUpdate: async ({ form, result }) => {
      const action = result.data;
      serverErrors = result.data.errors;
      if (form.valid) {
        joinIdValue = action.join_id;
      }
      creatingJoinId = false;
    }
  });
</script>

<div>
  <h2 class="mt-5 mb-2">Invite friends to your house</h2>
  <div class="join">
    <input
      disabled
      id="npm-install-copy-button"
      class="input join-item input-bordered disabled:text-neutral-content disabled:border-neutral disabled:bg-neutral bg-neutral text-base-300"
      value={joinIdValue} />
    <button
      class="btn btn-ghost join-item bg-neutral text-neutral-content border-none"
      disabled={!joinIdValue}
      use:copy={joinIdValue}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        ><g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          ><path
            d="M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z"
          ></path
          ><path
            d="M4.012 16.737A2 2 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1"
          ></path
          ></g
        ></svg>
    </button>
    <form action="?/toggle_join_id" method="POST" use:joinidEnhance>
      <button
        class="btn btn-accent join-item rounded-r-full border-none"
        disabled={creatingJoinId || !$page.data.user.is_admin}>
        {#if !creatingJoinId}
          {isActiveJoinId ? "Delete" : "Create"}
        {:else}
          <span class="loading loading-spinner loading-lg"></span>
        {/if}
      </button>
    </form>
  </div>
</div>
