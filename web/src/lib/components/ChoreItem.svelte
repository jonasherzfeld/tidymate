<script lang="ts">
  import { MenuDots, CircleIcon, RedoIcon } from "$lib/utils/icons";
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
  import {
    FREQUENCY_INTERVALS,
    ROOM_CONFIG,
    type RoomConfig
  } from "$lib/utils/constants";

  let {
    id = $bindable(),
    data = $bindable(),
    assignee = $bindable(),
    done = $bindable(),
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
  let defaultRoomConfig: RoomConfig | undefined = $derived(
    ROOM_CONFIG.find((item) => item.name === "General")
  );
  let roomConfig: RoomConfig | undefined = $derived(
    ROOM_CONFIG.find((item) => item.name === room)
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
    class="card card-bordered flex h-fit w-full flex-row items-start justify-between rounded-lg border-neutral bg-base-300 p-2 shadow-sm">
    <div class="flex h-full w-fit justify-start">
      <form
        class="flex"
        action="/home/chores?/check_chore&id={id}"
        method="POST"
        use:enhance={handleChecked}>
        <input
          type="checkbox"
          name="check_chore"
          class="checkbox-primary checkbox checkbox-md"
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
        <div
          class={`badge badge-info h-6 items-center gap-1 text-white ${roomConfig ? roomConfig.color : defaultRoomConfig?.color}`}>
          {#if roomConfig}
            <roomConfig.icon />
            {roomConfig.name}
          {:else if defaultRoomConfig}
            <defaultRoomConfig.icon />
            {defaultRoomConfig.name}
          {/if}
        </div>
        <h2 class="text-x mt-0 flex items-start pt-0">
          {data}
        </h2>
      </div>

      <div class="flex flex-row items-center">
        {#if deadline}
          <CircleIcon
            class={cn(
              "mr-1 h-3 w-3 text-info",
              deadlineDate <= deadlineWarningDate && "text-warning",
              deadlineDate <= deadlineErrorDate && "text-error"
            )} />
          <span
            class={cn(
              "justify-left w-fit  text-xs font-medium text-info",
              deadlineDate <= deadlineWarningDate && "text-warning",
              deadlineDate <= deadlineErrorDate && "text-error"
            )}>
            {daysToDoChore > 1
              ? `In ${daysToDoChore} days`
              : daysToDoChore == 1
                ? `Due tomorrow`
                : daysToDoChore == 0
                  ? "Due today"
                  : `${-daysToDoChore} days due`}
          </span>
        {/if}
        {#if assignee && assigneeName}
          <div class="divider divider-horizontal m-0 p-0"></div>

          <AvatarGraphic
            thumbnail={assigneeThumbnail}
            height="h-4"
            width="w-4"
            textSize="text-[0.4rem]"
            firstName={assigneeName.split(" ")[0]}
            lastName={assigneeName.split(" ")[1]} />
          <span class="pl-2 text-xs font-medium text-neutral-500"
            >{assigneeName}</span>
        {/if}
      </div>
      <div class="flex flex-row items-center">
        <RedoIcon class="mr-1 h-3 w-3 text-neutral-500" />

        <h2
          class="mt-0 flex items-start pt-0 text-xs font-medium text-neutral-500">
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
