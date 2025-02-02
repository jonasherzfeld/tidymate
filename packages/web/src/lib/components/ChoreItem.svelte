<script lang="ts">
  import { MenuDots, HouseIcon, CircleIcon, RedoIcon } from "$lib/utils/icons";
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
  import { FREQUENCY_INTERVALS } from "$lib/utils/constants";

  let {
    id = $bindable(),
    data = $bindable(),
    assignee = $bindable(),
    done = $bindable(),
    tags = $bindable(),
    deadline = $bindable(),
    frequency = $bindable(),
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
  let frequencyDescription: string | undefined = $derived(
    FREQUENCY_INTERVALS.find((item) => item.value === frequency)?.description
  );

  let deadlineDate: Date = $derived(new Date(deadline));
  let deadlineWarningDate: Date = new Date();
  deadlineWarningDate.setDate(new Date().getDate() + 1);
  let deadlineErrorDate: Date = new Date();
  deadlineErrorDate.setDate(new Date().getDate() + 0);
  let daysToDoChore: number = $derived(
    Math.ceil(
      (deadlineDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    )
  );

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

    <div
      class="justify-left mt-0 flex h-fit grow flex-col gap-1 pl-4 pr-2 pt-0 text-left">
      <div class="flex flex-row items-center gap-2">
        <div class="badge badge-info gap-2">
          <HouseIcon />
          {room ? room : "General"}
        </div>
        <h2 class="mt-0 flex items-start pt-0 text-xl">
          {data}
        </h2>
      </div>

      <div class="flex flex-row items-center">
        {#if deadline}
          <CircleIcon
            class={cn(
              "mr-1 h-3 w-3",
              deadlineDate <= deadlineWarningDate && "text-warning",
              deadlineDate <= deadlineErrorDate && "text-error"
            )} />
          <span
            class={cn(
              "justify-left text-info w-fit text-xs",
              deadlineDate <= deadlineWarningDate && "text-warning",
              deadlineDate <= deadlineErrorDate && "text-error"
            )}>
            {daysToDoChore > 0
              ? `In ${daysToDoChore} days`
              : `${-daysToDoChore} days due"`}
          </span>
          <div class="divider divider-horizontal m-0 p-0"></div>
        {/if}
        {#if assignee && assigneeName}
          <AvatarGraphic
            thumbnail={assigneeThumbnail}
            height="h-4"
            width="w-4"
            textSize="text-[0.4rem]"
            firstName={assigneeName.split(" ")[0]}
            lastName={assigneeName.split(" ")[1]} />
          <span class="pl-2 text-xs text-neutral-500">{assigneeName}</span>
        {:else}
          <img alt="User" src={UnknownAvatar} />
        {/if}
      </div>
      <div class="flex flex-row items-center">
        <RedoIcon class="mr-1 h-3 w-3 text-neutral-500" />

        <h2 class="mt-0 flex items-start pt-0 text-xs text-neutral-500">
          {frequencyDescription}
        </h2>
      </div>
    </div>

    <div class="flex h-full w-fit justify-end">
      <Dropdown>
        <DropdownButton className="btn-xs btn-square border-neutral">
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
