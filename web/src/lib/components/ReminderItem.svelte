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
    CATEGORY_CONFIG,
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
    category = $bindable(),
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
    category: string;
    onChange: (deadline: string) => void;
    onRemove: () => void;
  } = $props();

  let frequencyDescription: string | undefined = $derived(
    FREQUENCY_INTERVALS.find((item) => item.value === frequency)?.description
  );
  let defaultCategoryConfig: CategoryConfig | undefined = $derived(
    CATEGORY_CONFIG.find((item) => item.name === "General")
  );
  let categoryConfig: CategoryConfig | undefined = $derived(
    CATEGORY_CONFIG.find((item) => item.name === category)
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
      if (result.status === 200) {
        onChange(result.data.reminder.deadline);
      } else {
        update();
      }
    };
  };

  const handleRemove = async ({}) => {
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
        action="/home/reminders?/check_reminder&id={id}"
        method="POST"
        use:enhance={handleChecked}>
        <input
          type="checkbox"
          name="check_reminder"
          class="checkbox-primary checkbox checkbox-md"
          onchange={(e) => {
            e.target.form.requestSubmit();
            checkboxState = false;
          }}
          bind:checked={checkboxState} />
      </form>
    </div>

    <div
      class="justify-left mt-0 flex h-fit grow flex-col gap-1 pt-0 pr-2 pl-4 text-left">
      <div class="flex flex-row items-center gap-2">
        <div
          class={`badge badge-info h-6 items-center gap-1 text-white ${categoryConfig ? categoryConfig.color : defaultCategoryConfig?.color}`}>
          {#if categoryConfig}
            <categoryConfig.icon />
            {categoryConfig.name}
          {:else if defaultCategoryConfig}
            <defaultCategoryConfig.icon />
            {defaultCategoryConfig.name}
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
          <DropdownLinkItem href="/home/reminders/{id}">Edit</DropdownLinkItem>
          <form method="POST" use:enhance={handleRemove}>
            <DropdownActionItem
              action="/home/reminders?/delete_reminder&id={id}"
              >Delete</DropdownActionItem>
          </form>
        </DropdownContent>
      </Dropdown>
    </div>
  </div>
</div>
