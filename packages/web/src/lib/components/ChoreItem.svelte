<script lang="ts">
  import { MenuDots } from "$lib/utils/icons";
  import { enhance } from "$app/forms";
  import Dropdown from "./dropdown/Dropdown.svelte";
  import DropdownContent from "./dropdown/DropdownContent.svelte";
  import DropdownButton from "./dropdown/DropdownTrigger.svelte";
  import DropdownActionItem from "./dropdown/DropdownActionItem.svelte";
  import DropdownLinkItem from "./dropdown/DropdownLinkItem.svelte";
  import { getUsernameById, getThumbnailById } from "$lib/utils/helpers";
  import { page } from "$app/stores";
  import { cn } from "$lib/utils";
  import AvatarGraphic from "./AvatarGraphic.svelte";
  import UnknownAvatar from "$lib/img/Unknown_person.jpg";

  let {
    id = $bindable(),
    data = $bindable(),
    assignee = $bindable(),
    done = $bindable(),
    tags = $bindable(),
    deadline = $bindable(),
    last_done = $bindable(),
    room = $bindable(),
    severity = $bindable(),
    removedList = $bindable(),
    onchange
  }: {
    id: string;
    data: string;
    assignee: string;
    done: boolean;
    tags: string[];
    deadline: string;
    frequency: number;
    last_done: string;
    room: string;
    severity: ChoreSeverity;
    removedList: string[];
    onchange: (deadline: string) => void;
  } = $props();

  let assigneeName = $derived(
    getUsernameById(assignee, $page.data.house.members)
  );
  let assigneeThumbnail = $derived(
    getThumbnailById(assignee, $page.data.house.members) ?? ""
  );

  let deadlineDate: Date = $derived(new Date(deadline));
  let deadlineWarningDate: Date = new Date();
  deadlineWarningDate.setDate(new Date().getDate() + 1);
  let deadlineErrorDate: Date = new Date();
  deadlineErrorDate.setDate(new Date().getDate() + 0);

  let checkboxState = $state(false);

  const handleChecked = async ({}) => {
    return async ({ result, update }) => {
      if (result.status !== 200) {
        update();
      } else {
        onchange(result.data.chore.deadline);
      }
    };
  };

  const handleRemove = async ({}) => {
    return async ({ result, update }) => {
      if (result.status === 200) {
        removedList.push(result.data.chore_id);
      } else {
        await update();
      }
    };
  };
</script>

<div class="flex w-full">
  <div
    class="card card-bordered border-neutral bg-base-300 flex h-fit w-full flex-row items-start justify-between rounded-lg p-2 shadow-sm">
    <div class="flex h-full w-fit justify-start">
      <form
        class="flex"
        action="/home/chores?/check_chore&id={id}"
        method="POST"
        use:enhance={handleChecked}>
        <input
          type="checkbox"
          name="check_chore"
          class="checkbox checkbox-primary checkbox-md"
          onchange={(e) => {
            e.target.form.requestSubmit();
            checkboxState = false;
          }}
          bind:checked={checkboxState} />
      </form>
    </div>

    <div class="justify-left mt-0 h-fit grow gap-2 pl-4 pr-2 pt-0 text-left">
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
      </div>
    </div>
    <div class="flex h-full items-center pl-1 pr-2">
      {#if assignee && assigneeName}
        <AvatarGraphic
          thumbnail={assigneeThumbnail}
          height="h-8"
          width="w-8"
          textSize="text-sm"
          firstName={assigneeName.split(" ")[0]}
          lastName={assigneeName.split(" ")[1]} />
      {:else}
        <img alt="User" src={UnknownAvatar} />
      {/if}
    </div>
    <div class="flex h-full w-fit justify-end">
      <Dropdown>
        <DropdownButton className="btn-xs btn-square">
          <MenuDots />
        </DropdownButton>
        <DropdownContent>
          <DropdownLinkItem href="/home/chores/{id}">Edit</DropdownLinkItem>
          <form method="POST" use:enhance={handleRemove}>
            <DropdownActionItem action="/home/chores?/delete_chore&id={id}"
              >Delete</DropdownActionItem>
          </form>
        </DropdownContent>
      </Dropdown>
    </div>
  </div>
</div>
