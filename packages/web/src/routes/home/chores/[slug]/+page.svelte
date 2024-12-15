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
    import {
        CalendarIcon,
        ChevronLeft,
        UserIcon,
        CheckIcon,
        TextIcon,
        BedroomIcon
    } from '$lib/utils/icons';
    import { getUsernameById } from '$lib/utils/helpers';

    let { data }: { data: PageData } = $props();
    let choreItem = $state(data.chore);

    const isCreatingNewChore = data.slug === 'new';
    const df = new DateFormatter('en-US', {
        dateStyle: 'long'
    });

    let assigneeName: string | undefined = $derived(
        getUsernameById(choreItem.assignee, data.house.members)
    );
    let deadline: CalendarDate | undefined = $state(
        choreItem.deadline
            ? toCalendarDate(fromDate(new Date(choreItem.deadline), getLocalTimeZone()))
            : undefined
    );
    let isDeadlineInPast: boolean | undefined = $derived(
        deadline && deadline < toCalendarDate(now(getLocalTimeZone()))
    );

    let isChangingChore: boolean = $state(false);
    let serverErrors: string = $state('');
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

<div class="flex flex-col gap-3 min-w-full min-h-full">
    <form
        class="flex flex-col flex-1 gap-3"
        method="POST"
        action={isCreatingNewChore ? '?/create_chore' : '?/change_chore'}
        use:enhance
    >
        <div class="flex mt-3 relative items-center justify-start">
            <div class="items-center">
                <a href="/home/chores" class="flex items-center gap-1"><ChevronLeft />Back</a>
            </div>
        </div>

        <div class="flex flex-col flex-1 gap-3 min-w-full h-fit">
            <div class="flex flex-col gap-2 p-3 card-h-fit bg-base-300">
                <div class="text-2xl text-conter font-bold mb-2">
                    {isCreatingNewChore ? 'Create' : 'Edit'} Chore
                </div>
                {#if serverErrors}
                    <h1 class="mt-2 step-subtitle text-error">
                        {serverErrors}
                    </h1>
                {/if}

                <input class="hidden" name="id" value={choreItem.id} />

                <TextInput name="data" bind:value={choreItem.data} placeholder="Enter a Chore text">
                    <div class="flex items-center font-normal gap-2 w-24">
                        <TextIcon class="h-4 w-4" />Text
                    </div>
                </TextInput>
                {#if $errors.data}<span
                        class="flex w-full ml-2 invalid text-start text-error text-sm"
                        >{$errors.data}</span
                    >{/if}

                <TextInput
                    name="frequency"
                    bind:value={choreItem.frequency}
                    placeholder="Enter a Chore frequency"
                >
                    <div class="flex items-center font-normal gap-2 w-24">
                        <TextIcon class="h-4 w-4" />Frequency
                    </div>
                </TextInput>
                {#if $errors.frequency}<span
                        class="flex w-full ml-2 invalid text-start text-error text-sm"
                        >{$errors.frequency}</span
                    >{/if}

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
                    <input class="hidden" name="assignee" value={choreItem.assignee} />
                    <Dropdown.Content>
                        <Dropdown.TextItem
                            class="flex w-full justify-left font-bold pointer-events-none"
                            >Assignee</Dropdown.TextItem
                        >
                        <Dropdown.RadioItem
                            radioName="assigneeRadio"
                            checked={choreItem.assignee === ''}
                            onchange={() => {
                                choreItem.assignee = '';
                            }}>None</Dropdown.RadioItem
                        >
                        {#each data.house.members as member}
                            <Dropdown.RadioItem
                                radioName="assigneeRadio"
                                checked={choreItem.assignee === member.id}
                                onchange={() => {
                                    choreItem.assignee = member.id;
                                }}>{member.first_name + ' ' + member.last_name}</Dropdown.RadioItem
                            >
                        {/each}
                    </Dropdown.Content>
                </Dropdown.Root>
                {#if $errors.assignee}<span
                        class="flex w-full ml-2 invalid text-start text-error text-sm"
                        >{$errors.assignee}</span
                    >{/if}

                <Dropdown.Root>
                    <button
                        type="button"
                        tabindex="0"
                        class="btn btn-outline bg-base-100 input-bordered rounded-md w-full text-normal"
                    >
                        <div class="flex items-center font-normal gap-2 w-24">
                            <BedroomIcon class="h-4 w-4" />Room
                        </div>
                        <span class="text-right font-normal grow">
                            {choreItem.room ? choreItem.room : 'Set room'}
                        </span>
                    </button>
                    <input class="hidden" name="room" value={choreItem.room} />
                    <Dropdown.Content>
                        <Dropdown.TextItem
                            class="flex w-full justify-left font-bold pointer-events-none"
                            >Room</Dropdown.TextItem
                        >
                        <Dropdown.RadioItem
                            radioName="roomRadio"
                            checked={choreItem.room === ''}
                            onchange={() => {
                                choreItem.room = '';
                            }}>None</Dropdown.RadioItem
                        >
                        {#each data.house.rooms as room}
                            <Dropdown.RadioItem
                                radioName="roomRadio"
                                checked={choreItem.room === room}
                                onchange={() => {
                                    choreItem.room = room;
                                }}>{room}</Dropdown.RadioItem
                            >
                        {/each}
                    </Dropdown.Content>
                </Dropdown.Root>
                {#if $errors.room}<span
                        class="flex w-full ml-2 invalid text-start text-error text-sm"
                        >{$errors.room}</span
                    >{/if}

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
                {#if isDeadlineInPast || $errors.deadline}
                    <span class="text-error">Deadline must be in the future</span>
                {/if}
                <button class={cn('btn btn-primary text-white', isChangingChore && 'btn-disabled')}>
                    {#if !isChangingChore}
                        <CheckIcon class="w-4 h-4" /> Save
                        {isCreatingNewChore ? 'Chore' : 'Changes'}
                    {:else}
                        <span class="loading loading-spinner loading-lg"></span>
                    {/if}
                </button>
            </div>
        </div>
    </form>
</div>
