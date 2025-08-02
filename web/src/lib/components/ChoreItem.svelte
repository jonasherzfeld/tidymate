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
    type CategoryConfig
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
    onChange,
    onRemove
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
    onChange: (deadline: string) => void;
    onRemove: () => void;
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
  let defaultRoomConfig: CategoryConfig | undefined = $derived(
    ROOM_CONFIG.find((item) => item.name === "General")
  );
  let roomConfig: CategoryConfig | undefined = $derived(
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

  let lastDone: Date = $derived(new Date(last_done));
  let daysSinceLastDone: number | undefined = $derived(
    last_done === ""
      ? undefined
      : Math.floor(
          (new Date().getTime() - lastDone.getTime()) / (1000 * 3600 * 24)
        )
  );

  let checkboxState = $state(false);

  const handleChecked = async () => {
    return async ({ result, update }) => {
      if (result.status === 200) {
        onChange(result.data.chore.deadline);
      } else {
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
          class={`badge  h-6 items-center gap-1 text-white ${roomConfig ? roomConfig.color : defaultRoomConfig?.color}`}>
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
              "text-info mr-1 h-3 w-3",
              deadlineDate <= deadlineWarningDate && "text-warning",
              deadlineDate <= deadlineErrorDate && "text-error"
            )} />
          <span
            class={cn(
              "justify-left text-info  w-fit text-xs font-medium",
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
          {#if daysSinceLastDone !== undefined}
            {#if daysSinceLastDone === 0}
              - last done today
            {:else if daysSinceLastDone === 1}
              - last done yesterday
            {:else}
              - last done {daysSinceLastDone} days ago
            {/if}
          {/if}
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
