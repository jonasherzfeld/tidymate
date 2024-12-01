<script lang="ts">
    import {
        type CalendarDate,
        DateFormatter,
        getLocalTimeZone,
        now,
        fromDate,
        toCalendarDate
    } from '@internationalized/date';
    import { cn } from '$lib/utils.js';
    import { Button } from '$lib/components/ui/button';
    import { Calendar } from '$lib/components/ui/calendar';
    import * as Popover from '$lib/components/ui/popover';
    import type { PageData } from './$types';
    import TextInput from '$lib/components/TextInput.svelte';
    import * as Dropdown from '$lib/components/dropdown/index.js';
    import { superForm } from 'sveltekit-superforms';
    import { CalendarIcon, ChevronLeft, UserIcon, CheckIcon, TextIcon } from '$lib/utils/icons';
    import { getUsernameById } from '$lib/utils/helpers';

    let { data }: { data: PageData } = $props();
    let todoItem = $state(data.todo);

    const df = new DateFormatter('en-US', {
        dateStyle: 'long'
    });

    let assigneeName: string | undefined = $derived(
        getUsernameById(todoItem.assignee, data.house.members)
    );
    let deadline: CalendarDate | undefined = $state(
        todoItem.deadline
            ? toCalendarDate(fromDate(new Date(todoItem.deadline), getLocalTimeZone()))
            : undefined
    );
    let isDeadlineInPast: boolean | undefined = $derived(
        deadline && deadline < toCalendarDate(now(getLocalTimeZone()))
    );

    let isChangingTodo: boolean = $state(false);
    let serverErrors: string = $state('');
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

<div class="flex flex-col gap-3 min-w-full min-h-full">
    <form class="flex flex-col flex-1 gap-3" method="POST" action="?/change_todo" use:enhance>
        <div class="flex mt-3 relative items-center justify-start">
            <div class="items-center">
                <a href="/home/todo" class="flex items-center gap-1"><ChevronLeft />Back</a>
            </div>
        </div>

        <div class="flex flex-col flex-1 gap-3 min-w-full h-fit">
            <div class="flex flex-col gap-2 p-3 card-h-fit bg-base-300">
                <div class="text-2xl text-conter font-bold mb-2">Edit Todo</div>
                {#if serverErrors}
                    <h1 class="mt-2 step-subtitle text-error">
                        {serverErrors}
                    </h1>
                {/if}
                <input class="hidden" name="id" value={todoItem.id} />
                <TextInput name="data" bind:value={todoItem.data} placeholder="Enter a Todo text">
                    <div class="flex items-center font-normal gap-2 w-24">
                        <TextIcon class="h-4 w-4" />Text
                    </div>
                </TextInput>
                <Dropdown.Root>
                    <button
                        type="button"
                        tabindex="0"
                        class="btn btn-outline bg-base-100 input-bordered rounded-md w-full text-normal"
                    >
                        <div class="flex items-center font-normal gap-2 w-24">
                            <UserIcon class="h-4 w-4" />Assignee
                        </div>
                        <span class="text-right font-normal grow">
                            {assigneeName ? assigneeName : 'Set assignee'}
                        </span>
                    </button>
                    <input class="hidden" name="assignee" value={todoItem.assignee} />
                    <Dropdown.Content>
                        <Dropdown.TextItem
                            class="flex w-full justify-left font-bold pointer-events-none"
                            >Assignee</Dropdown.TextItem
                        >
                        {#each data.house.members as member}
                            <Dropdown.RadioItem
                                radioName="assigneeRadio"
                                checked={todoItem.assignee === member.id}
                                onchange={() => {
                                    todoItem.assignee = member.id;
                                }}>{member.first_name + ' ' + member.last_name}</Dropdown.RadioItem
                            >
                        {/each}
                    </Dropdown.Content>
                </Dropdown.Root>

                <input class="hidden" name="deadline" value={deadline} />
                <Popover.Root openFocus>
                    <Popover.Trigger asChild let:builder>
                        <Button
                            variant="outline"
                            class={cn(
                                'btn btn-outline bg-base-100 input-bordered rounded-md w-full text-left font-normal hover:bg-[var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)))] justify-between',
                                !deadline && 'text-muted-foreground',
                                isDeadlineInPast && 'input-error'
                            )}
                            builders={[builder]}
                        >
                            <div class="flex items-center gap-2 w-24">
                                <CalendarIcon class="h-4 w-4" />Deadline
                            </div>
                            {deadline
                                ? df.format(deadline.toDate(getLocalTimeZone()))
                                : 'Set a deadline'}
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content class="w-auto p-0 bg-base-100">
                        <Calendar bind:value={deadline} initialFocus />
                    </Popover.Content>
                </Popover.Root>
                {#if deadline && isDeadlineInPast}
                    <span class="text-error">Deadline must be in the future</span>
                {/if}
                <button class={cn('btn btn-primary text-white', isChangingTodo && 'btn-disabled')}>
                    {#if !isChangingTodo}
                        <CheckIcon class="w-4 h-4" /> Save Changes
                    {:else}
                        <span class="loading loading-spinner loading-lg"></span>
                    {/if}
                </button>
            </div>
        </div>
    </form>
</div>
