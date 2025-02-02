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
  import { Button } from "$lib/components/ui/button";
  import { Calendar } from "$lib/components/ui/calendar";
  import * as Popover from "$lib/components/ui/popover";
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
    BedroomIcon
  } from "$lib/utils/icons";
  import { getUsernameById } from "$lib/utils/helpers";
  import { FREQUENCY_INTERVALS } from "$lib/utils/constants";

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
      <div class="card-h-fit bg-base-300 flex flex-col gap-2 p-3">
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
            class="btn btn-outline bg-base-100 input-bordered text-normal w-full rounded-md">
            <div class="flex w-24 items-center gap-2 font-normal">
              <UserIcon class="h-4 w-4" />Frequency
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
            class="btn btn-outline bg-base-100 input-bordered text-normal w-full rounded-md">
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
            class="btn btn-outline bg-base-100 input-bordered text-normal w-full rounded-md">
            <div class="flex w-24 items-center gap-2 font-normal">
              <BedroomIcon class="h-4 w-4" />Room
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
            <Dropdown.RadioItem
              radioName="roomRadio"
              checked={choreItem.room === ""}
              onchange={() => {
                choreItem.room = "";
              }}>None</Dropdown.RadioItem>
            {#each data.house.rooms as room}
              <Dropdown.RadioItem
                radioName="roomRadio"
                checked={choreItem.room === room}
                onchange={() => {
                  choreItem.room = room;
                }}>{room}</Dropdown.RadioItem>
            {/each}
          </Dropdown.Content>
        </Dropdown.Root>
        {#if $errors.room}<span
            class="invalid text-error ml-2 flex w-full text-start text-sm"
            >{$errors.room}</span
          >{/if}

        <input class="hidden" name="deadline" value={deadline} />
        <Popover.Root openFocus>
          <Popover.Trigger asChild let:builder>
            <Button
              variant="outline"
              class={cn(
                "btn btn-outline bg-base-100 input-bordered w-full justify-between rounded-md text-left font-normal hover:bg-[var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)))]",
                !deadline && "text-muted-foreground",
                isDeadlineInPast && "input-error"
              )}
              builders={[builder]}>
              <div class="flex w-24 items-center gap-2">
                <CalendarIcon class="h-4 w-4" />Deadline
              </div>
              {deadline
                ? df.format(deadline.toDate(getLocalTimeZone()))
                : "Set a deadline"}
            </Button>
          </Popover.Trigger>
          <Popover.Content class="bg-base-100 w-auto p-0">
            <Calendar bind:value={deadline} initialFocus />
          </Popover.Content>
        </Popover.Root>
        {#if isDeadlineInPast || $errors.deadline}
          <span class="text-error">Deadline must be in the future</span>
        {/if}
        <button
          class={cn(
            "btn btn-primary text-white",
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
