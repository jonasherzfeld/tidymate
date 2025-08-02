<script lang="ts">
  import { MenuDots } from "$lib/utils/icons";
  import { enhance } from "$app/forms";
  import Dropdown from "./dropdown/Dropdown.svelte";
  import DropdownContent from "./dropdown/DropdownContent.svelte";
  import DropdownButton from "./dropdown/DropdownTrigger.svelte";
  import DropdownActionItem from "./dropdown/DropdownActionItem.svelte";
  import DropdownLinkItem from "./dropdown/DropdownLinkItem.svelte";
  import { getUsernameById } from "$lib/utils/helpers";
  import { page } from "$app/stores";
  import { cn } from "$lib/utils";

  let {
    id = $bindable(),
    data = $bindable(),
    assignee = $bindable(),
    done = $bindable(),
    created_on = $bindable(),
    deadline = $bindable(),
    onChange,
    onRemove
  }: {
    id: string;
    data: string;
    assignee: string;
    done: boolean;
    created_on: string;
    deadline: string;
    onChange: (b: boolean) => void;
    onRemove: () => void;
  } = $props();

  let assigneeName = $derived(
    getUsernameById(assignee, $page.data.house.members)
  );

  let deadlineDate: Date = $derived(new Date(deadline));
  let deadlineWarningDate: Date = new Date();
  deadlineWarningDate.setDate(new Date().getDate() + 1);
  let deadlineErrorDate: Date = new Date();
  deadlineErrorDate.setDate(new Date().getDate() + 0);

  const handleChecked = async () => {
    return async ({ result, update }) => {
      if (result.status !== 200) {
        update();
      }
    };
  };

  const handleRemove = async () => {
    return async ({ result, update }) => {
      if (result.status === 200) {
        onRemove();
      } else {
        await update();
      }
    };
  };
</script>

<div class="flex w-full">
  <div
    class="card bg-base-300 flex h-fit w-full flex-row items-start justify-between rounded-lg p-2">
    <div class="flex h-full w-fit justify-start">
      <form
        class="flex"
        action="/home/todo?/check_todo&id={id}"
        method="POST"
        use:enhance={handleChecked}>
        <input
          type="checkbox"
          name="check_todo"
          class="checkbox-primary checkbox checkbox-md"
          onchange={(e) => {
            done = e.target.checked;
            onChange(done);
            e.target.form.requestSubmit();
          }}
          bind:checked={done} />
      </form>
    </div>

    <div class="justify-left mt-0 h-fit grow pl-4 pr-2 pt-0 text-left">
      <h2 class={`mt-0 flex items-start pt-0 ${done ? "text-primary" : ""}`}>
        {data}
      </h2>

      <div class="flex">
        {#if deadline}
          <span
            class={cn(
              "justify-left text-info w-fit pr-3 text-xs",
              deadlineDate <= deadlineWarningDate && "text-warning",
              deadlineDate <= deadlineErrorDate && "text-error"
            )}>{deadlineDate.toDateString()}</span>
        {/if}
        {#if assigneeName}
          <h2 class="card-compact text-xs">
            {assigneeName}
          </h2>
        {/if}
      </div>
    </div>
    <div class="flex h-full w-fit justify-end">
      <Dropdown>
        <DropdownButton className="btn-xs btn-square">
          <MenuDots />
        </DropdownButton>
        <DropdownContent>
          <DropdownLinkItem href="/home/todo/{id}">Edit</DropdownLinkItem>
          <form method="POST" use:enhance={handleRemove}>
            <DropdownActionItem action="/home/todo?/delete_todo&id={id}"
              >Delete</DropdownActionItem>
          </form>
        </DropdownContent>
      </Dropdown>
    </div>
  </div>
</div>
