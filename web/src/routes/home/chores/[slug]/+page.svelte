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

  let myDatepicker;
  $effect(() => {
    if (myDatepicker) {
      const picker = new Pikaday({
        field: myDatepicker
      });
      return () => picker.destroy();
    }
  });

  let { data }: { data: PageData } = $props();
  let choreItem = $state(data.chore);

  const isCreatingNewChore = data.slug === "new";
  const df = new DateFormatter("en-US", {
    dateStyle: "long"
  });

  let assigneeName: string | undefined = $derived(
    getUsernameById(choreItem.assignee, data.house.members)
  );
  let frequencyDescription: string | undefined = $derived(
    FREQUENCY_INTERVALS.find(
      (frequency) => frequency.value === choreItem.frequency
    )?.description
  );
  let deadline: CalendarDate | undefined = $state(
    choreItem.deadline
      ? toCalendarDate(
          fromDate(new Date(choreItem.deadline), getLocalTimeZone())
        )
      : undefined
  );
  let isDeadlineInPast: boolean | undefined = $derived(
    deadline && deadline < toCalendarDate(now(getLocalTimeZone()))
  );

  let isChangingChore: boolean = $state(false);
  let serverErrors: string = $state("");
  const { enhance, errors } = superForm(data.choreItemForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => {
      isChangingChore = true;
    },
    onUpdate: async ({ form, result }) => {
      serverErrors = result.data.errors;
      isChangingChore = false;
    }
  });
</script>

<div class="flex min-h-full min-w-full flex-col gap-3">
  <form
    class="flex flex-1 flex-col gap-3"
    method="POST"
    action={isCreatingNewChore ? "?/create_chore" : "?/change_chore"}
    use:enhance>
    <div class="relative mt-3 flex items-center justify-start">
      <div class="items-center">
        <a href="/home/chores" class="flex items-center gap-1"
          ><ChevronLeft />Back</a>
      </div>
    </div>

    <div class="flex h-fit min-w-full flex-1 flex-col gap-3">
      <div class="card bg-base-300 flex h-fit flex-col gap-2 p-3">
        <div class="text-conter mb-2 text-2xl font-bold">
          {isCreatingNewChore ? "Create" : "Edit"} Chore
        </div>
        {#if serverErrors}
          <h1 class="step-subtitle text-error mt-2">
            {serverErrors}
          </h1>
        {/if}

        <input class="hidden" name="id" value={choreItem.id} />

        <TextInput
          name="data"
          bind:value={choreItem.data}
          placeholder="Enter a Chore text">
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
          <input class="hidden" name="frequency" value={choreItem.frequency} />
          <Dropdown.Content>
            <Dropdown.TextItem
              class="justify-left pointer-events-none flex w-full font-bold"
              >Frequency</Dropdown.TextItem>
            {#each FREQUENCY_INTERVALS as interval}
              <Dropdown.RadioItem
                radioName="intervalRadio"
                checked={choreItem.frequency === interval.value}
                onchange={() => {
                  choreItem.frequency = interval.value;
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
          <input class="hidden" name="assignee" value={choreItem.assignee} />
          <Dropdown.Content>
            <Dropdown.TextItem
              class="justify-left pointer-events-none flex w-full font-bold"
              >Assignee</Dropdown.TextItem>
            <Dropdown.RadioItem
              radioName="assigneeRadio"
              checked={choreItem.assignee === ""}
              onchange={() => {
                choreItem.assignee = "";
              }}>None</Dropdown.RadioItem>
            {#each data.house.members as member}
              <Dropdown.RadioItem
                radioName="assigneeRadio"
                checked={choreItem.assignee === member.id}
                onchange={() => {
                  choreItem.assignee = member.id;
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
              {choreItem.room ? choreItem.room : "Set room"}
            </span>
          </button>
          <input class="hidden" name="room" value={choreItem.room} />
          <Dropdown.Content>
            <Dropdown.TextItem
              class="justify-left pointer-events-none flex w-full font-bold"
              >Room</Dropdown.TextItem>
            <!-- TODO: Enable handling of rooms for each house
             {#each data.house.rooms as room} -->
            {#each ROOM_CONFIG as room}
              <Dropdown.RadioItem
                radioName="roomRadio"
                checked={choreItem.room === room.name}
                onchange={() => {
                  choreItem.room = room.name;
                }}>{room.name}</Dropdown.RadioItem>
            {/each}
          </Dropdown.Content>
        </Dropdown.Root>
        {#if $errors.room}<span
            class="invalid text-error ml-2 flex w-full text-start text-sm"
            >{$errors.room}</span
          >{/if}

        <input
          type="text"
          class={cn(
            "input pika-single w-full",
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
            isChangingChore && "btn-disabled"
          )}>
          {#if !isChangingChore}
            <CheckIcon class="h-4 w-4" /> Save
            {isCreatingNewChore ? "Chore" : "Changes"}
          {:else}
            <span class="loading loading-spinner loading-lg"></span>
          {/if}
        </button>
      </div>
    </div>
  </form>
</div>
