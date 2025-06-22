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
  import type { PageData } from "./$types";
  import TextInput from "$lib/components/TextInput.svelte";
  import * as Dropdown from "$lib/components/dropdown/index.js";
  import { superForm } from "sveltekit-superforms";
  import {
    CalendarIcon,
    ChevronLeft,
    UserIcon,
    CheckIcon,
    TextIcon
  } from "$lib/utils/icons";
  import { getUsernameById } from "$lib/utils/helpers";
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
  let todoItem = $state(data.todo);

  const df = new DateFormatter("en-US", {
    dateStyle: "long"
  });

  let assigneeName: string | undefined = $derived(
    getUsernameById(todoItem.assignee, data.house.members)
  );
  let deadline: CalendarDate | undefined = $state(
    todoItem.deadline
      ? toCalendarDate(
          fromDate(new Date(todoItem.deadline), getLocalTimeZone())
        )
      : undefined
  );
  let isDeadlineInPast: boolean | undefined = $derived(
    deadline && deadline < toCalendarDate(now(getLocalTimeZone()))
  );

  let isChangingTodo: boolean = $state(false);
  let serverErrors: string = $state("");
  const { enhance, errors } = superForm(data.todoItemForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => {
      isChangingTodo = true;
    },
    onUpdate: async ({ form, result }) => {
      serverErrors = result.data.errors;
      isChangingTodo = false;
    }
  });
</script>

<div class="flex min-h-full min-w-full flex-col gap-3">
  <form
    class="flex flex-1 flex-col gap-3"
    method="POST"
    action="?/change_todo"
    use:enhance>
    <div class="relative mt-3 flex items-center justify-start">
      <div class="items-center">
        <a href="/home/todo" class="flex items-center gap-1"
          ><ChevronLeft />Back</a>
      </div>
    </div>

    <div class="flex h-fit min-w-full flex-1 flex-col gap-3">
      <div class="card-h-fit bg-base-300 flex flex-col gap-2 p-3">
        <div class="text-conter mb-2 text-2xl font-bold">Edit Todo</div>
        {#if serverErrors}
          <h1 class="step-subtitle text-error mt-2">
            {serverErrors}
          </h1>
        {/if}

        <input class="hidden" name="id" value={todoItem.id} />

        <TextInput
          name="data"
          bind:value={todoItem.data}
          placeholder="Enter a Todo text">
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
            class="text-normal btn btn-outline input-bordered bg-base-100 w-full rounded-md">
            <div class="flex w-24 items-center gap-2 font-normal">
              <UserIcon class="h-4 w-4" />Assignee
            </div>
            <span class="grow text-right font-normal">
              {assigneeName ? assigneeName : "Set assignee"}
            </span>
          </button>
          <input class="hidden" name="assignee" value={todoItem.assignee} />
          <Dropdown.Content>
            <Dropdown.TextItem
              class="justify-left pointer-events-none flex w-full font-bold"
              >Assignee</Dropdown.TextItem>
            <Dropdown.RadioItem
              radioName="assigneeRadio"
              checked={todoItem.assignee === ""}
              onchange={() => {
                todoItem.assignee = "";
              }}>None</Dropdown.RadioItem>
            {#each data.house.members as member}
              <Dropdown.RadioItem
                radioName="assigneeRadio"
                checked={todoItem.assignee === member.id}
                onchange={() => {
                  todoItem.assignee = member.id;
                }}
                >{member.first_name +
                  " " +
                  member.last_name}</Dropdown.RadioItem>
            {/each}
          </Dropdown.Content>
        </Dropdown.Root>
        {#if $errors.assignee}
          <span class="invalid text-error ml-2 flex w-full text-start text-sm"
            >{$errors.assignee}</span>
        {/if}

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
          <span class="invalid text-error ml-2 flex w-full text-start text-sm"
            >Deadline must be in the future</span>
        {/if}

        <button
          class={cn(
            "btn btn-primary text-white",
            isChangingTodo && "btn-disabled"
          )}>
          {#if !isChangingTodo}
            <CheckIcon class="h-4 w-4" /> Save Changes
          {:else}
            <span class="loading loading-spinner loading-lg"></span>
          {/if}
        </button>
      </div>
    </div>
  </form>
</div>
