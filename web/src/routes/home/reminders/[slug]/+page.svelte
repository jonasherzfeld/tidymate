<script lang="ts">
  import {
    type CalendarDate,
    DateFormatter,
    getLocalTimeZone,
    now,
    fromDate,
    toCalendarDate
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import type { PageData } from "./$types";
  import TextInput from "$lib/components/TextInput.svelte";
  import * as Dropdown from "$lib/components/dropdown/index.js";
  import { superForm } from "sveltekit-superforms";
  import {
    CalendarIcon,
    ChevronLeft,
    UserIcon,
    CheckIcon,
    TextIcon,
    RoomFilterIcon,
    RedoIcon
  } from "$lib/utils/icons";
  import { getUsernameById } from "$lib/utils/helpers";
  import { FREQUENCY_INTERVALS, ROOM_CONFIG } from "$lib/utils/constants";
  import Pikaday from "pikaday";
  import { browser } from "$app/environment";
  let myDatepicker;
  $effect(() => {
    if (browser && myDatepicker) {
      const picker = new Pikaday({
        field: myDatepicker
      });
      return () => picker.destroy();
    }
  });

  let { data }: { data: PageData } = $props();
  let reminderItem = $state(data.reminder);

  const isCreatingNewReminder = data.slug === "new";
  const df = new DateFormatter("en-US", {
    dateStyle: "long"
  });

  let assigneeName: string | undefined = $derived(
    getUsernameById(reminderItem.assignee, data.house.members)
  );
  let frequencyDescription: string | undefined = $derived(
    FREQUENCY_INTERVALS.find(
      (frequency) => frequency.value === reminderItem.frequency
    )?.description
  );
  let deadline: CalendarDate | undefined = $state(
    reminderItem.deadline
      ? toCalendarDate(
          fromDate(new Date(reminderItem.deadline), getLocalTimeZone())
        )
      : undefined
  );
  let isDeadlineInPast: boolean | undefined = $derived(
    deadline && deadline < toCalendarDate(now(getLocalTimeZone()))
  );

  let isChangingReminder: boolean = $state(false);
  let serverErrors: string = $state("");
  const { enhance, errors } = superForm(data.reminderItemForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => {
      isChangingReminder = true;
    },
    onUpdate: async ({ form, result }) => {
      serverErrors = result.data.errors;
      isChangingReminder = false;
    }
  });
</script>

<div class="flex min-h-full min-w-full flex-col gap-3">
  <form
    class="flex flex-1 flex-col gap-3"
    method="POST"
    action={isCreatingNewReminder ? "?/create_reminder" : "?/change_reminder"}
    use:enhance>
    <div class="relative mt-3 flex items-center justify-start">
      <div class="items-center">
        <a href="/home/reminders" class="flex items-center gap-1"
          ><ChevronLeft />Back</a>
      </div>
    </div>

    <div class="flex h-fit min-w-full flex-1 flex-col gap-3">
      <div class="card bg-base-300 flex h-fit flex-col gap-2 p-3">
        <div class="text-conter mb-2 text-2xl font-bold">
          {isCreatingNewReminder ? "Create" : "Edit"} Reminder
        </div>
        {#if serverErrors}
          <h1 class="step-subtitle text-error mt-2">
            {serverErrors}
          </h1>
        {/if}

        <input class="hidden" name="id" value={reminderItem.id} />

        <TextInput
          name="data"
          bind:value={reminderItem.data}
          placeholder="Enter a Reminder text">
          <div class="flex w-24 items-center gap-2 font-normal">
            <TextIcon class="h-4 w-4" />Text
          </div>
        </TextInput>
        {#if $errors.data}<span
            class="invalid text-error ml-2 flex w-full text-start text-sm"
            >{$errors.data}</span
          >{/if}

        <Dropdown.Root>
          <button
            type="button"
            tabindex="0"
            class="text-normal btn btn-outline input-bordered no-animation bg-base-100 w-full animate-none rounded-md">
            <div class="flex w-24 items-center gap-2 font-normal">
              <RedoIcon class="h-4 w-4" />Frequency
            </div>
            <span class="grow text-right font-normal">
              {frequencyDescription ? frequencyDescription : "Set frequency"}
            </span>
          </button>
          <input
            class="hidden"
            name="frequency"
            value={reminderItem.frequency} />
          <Dropdown.Content>
            <Dropdown.TextItem
              class="justify-left pointer-events-none flex w-full font-bold"
              >Frequency</Dropdown.TextItem>
            {#each FREQUENCY_INTERVALS as interval}
              <Dropdown.RadioItem
                radioName="intervalRadio"
                checked={reminderItem.frequency === interval.value}
                onchange={() => {
                  reminderItem.frequency = interval.value;
                }}>{interval.description}</Dropdown.RadioItem>
            {/each}
          </Dropdown.Content>
        </Dropdown.Root>

        {#if $errors.frequency}<span
            class="invalid text-error ml-2 flex w-full text-start text-sm"
            >{$errors.frequency}</span
          >{/if}

        <Dropdown.Root>
          <button
            type="button"
            tabindex="0"
            class="text-normal btn btn-outline input-bordered no-animation bg-base-100 w-full animate-none rounded-md">
            <div class="flex w-24 items-center gap-2 font-normal">
              <UserIcon class="h-4 w-4" />Assignee
            </div>
            <span class="grow text-right font-normal">
              {assigneeName ? assigneeName : "Set assignee"}
            </span>
          </button>
          <input class="hidden" name="assignee" value={reminderItem.assignee} />
          <Dropdown.Content>
            <Dropdown.TextItem
              class="justify-left pointer-events-none flex w-full font-bold"
              >Assignee</Dropdown.TextItem>
            <Dropdown.RadioItem
              radioName="assigneeRadio"
              checked={reminderItem.assignee === ""}
              onchange={() => {
                reminderItem.assignee = "";
              }}>None</Dropdown.RadioItem>
            {#each data.house.members as member}
              <Dropdown.RadioItem
                radioName="assigneeRadio"
                checked={reminderItem.assignee === member.id}
                onchange={() => {
                  reminderItem.assignee = member.id;
                }}
                >{member.first_name +
                  " " +
                  member.last_name}</Dropdown.RadioItem>
            {/each}
          </Dropdown.Content>
        </Dropdown.Root>
        {#if $errors.assignee}<span
            class="invalid text-error ml-2 flex w-full text-start text-sm"
            >{$errors.assignee}</span
          >{/if}

        <Dropdown.Root>
          <button
            type="button"
            tabindex="0"
            class="text-normal btn btn-outline input-bordered no-animation bg-base-100 w-full animate-none rounded-md">
            <div class="flex w-24 items-center gap-2 font-normal">
              <RoomFilterIcon class="h-4 w-4" />Room
            </div>
            <span class="grow text-right font-normal">
              {reminderItem.category ? reminderItem.category : "Set Category"}
            </span>
          </button>
          <input class="hidden" name="category" value={reminderItem.category} />
          <Dropdown.Content>
            <Dropdown.TextItem
              class="justify-left pointer-events-none flex w-full font-bold"
              >Room</Dropdown.TextItem>
            <!-- TODO: Enable handling of rooms for each house
             {#each data.house.rooms as room} -->
            {#each ROOM_CONFIG as room}
              <Dropdown.RadioItem
                radioName="categoryRadio"
                checked={reminderItem.category === room.name}
                onchange={() => {
                  reminderItem.category = room.name;
                }}>{room.name}</Dropdown.RadioItem>
            {/each}
          </Dropdown.Content>
        </Dropdown.Root>
        {#if $errors.category}<span
            class="invalid text-error ml-2 flex w-full text-start text-sm"
            >{$errors.category}</span
          >{/if}

        <input
          type="text"
          class={cn(
            "input pika-single",
            !deadline && "text-muted-foreground",
            isDeadlineInPast && "input-error"
          )}
          bind:this={myDatepicker}
          name="deadline"
          value={deadline
            ? df.format(deadline.toDate(getLocalTimeZone()))
            : "Set a deadline"} />
        {#if isDeadlineInPast || $errors.deadline}
          {#if $errors.deadline}<span
              class="invalid text-error ml-2 flex w-full text-start text-sm"
              >Deadline must be in the future</span
            >{/if}
        {/if}
        <button
          class={cn(
            "btn btn-primary no-animation animate-none text-white",
            isChangingReminder && "btn-disabled"
          )}>
          {#if !isChangingReminder}
            <CheckIcon class="h-4 w-4" /> Save
            {isCreatingNewReminder ? "Reminder" : "Changes"}
          {:else}
            <span class="loading loading-spinner loading-lg"></span>
          {/if}
        </button>
      </div>
    </div>
  </form>
</div>
