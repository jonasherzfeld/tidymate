<script lang="ts">
    import CalendarIcon from 'lucide-svelte/icons/calendar';
    import {
        type DateValue,
        DateFormatter,
        getLocalTimeZone,
        today,
        fromDate
    } from '@internationalized/date';
    import { cn } from '$lib/utils.js';
    import { Button } from '$lib/components/ui/button';
    import { Calendar } from '$lib/components/ui/calendar';
    import * as Popover from '$lib/components/ui/popover';
    import ChevronLeft from 'virtual:icons/fluent/chevron-left-28-filled';
    import type { PageData } from './$types';
    import TextInput from '$lib/components/TextInput.svelte';
    import * as Dropdown from '$lib/components/dropdown/index.js';

    let { data }: { data: PageData } = $props();
    let todoItem = $state(data.todo);

    const df = new DateFormatter('en-US', {
        dateStyle: 'long'
    });

    function getAssigneeName(assigneeId: string): string | undefined {
        if (!assigneeId) return undefined;
        const member = data.house.members.find((member) => member.id === assigneeId);
        return member ? member.first_name + ' ' + member.last_name : undefined;
    }
    let assignee: string | undefined = $state(getAssigneeName(todoItem.assignee));
    let deadline: DateValue | undefined = $state(
        todoItem.deadline
            ? fromDate(new Date(Date.parse(todoItem.deadline)), getLocalTimeZone())
            : undefined
    );
</script>

<div class="flex flex-col gap-3 min-w-full min-h-full justify-between">
    <div class="flex mt-3 relative items-center justify-start">
        <div class="items-center">
            <a href="/home/todo" class="flex items-center gap-1"><ChevronLeft />Back</a>
        </div>
    </div>
    <div class="flex flex-col flex-1 gap-3 min-w-full">
        <div class=" flex flex-col flex-1 gap-2 p-3 card bg-base-300">
            <div class="text-2xl text-conter font-bold mb-">Edit Todo</div>
            <TextInput name="data" bind:value={todoItem.data} placeholder="Enter a Todo text"
                >Text</TextInput
            >
            <Dropdown.Root>
                <TextInput name="assignee" value={assignee} placeholder="Assign todo"
                    >Assignee</TextInput
                >
                <Dropdown.Content>
                    <Dropdown.TextItem
                        class="flex w-full justify-left font-bold pointer-events-none"
                        >Assignee</Dropdown.TextItem
                    >
                    {#each data.house.members as member}
                        <Dropdown.RadioItem
                            radioName="assignee"
                            name="assignee"
                            checked={todoItem.assignee === member.id}
                            onchange={() => {
                                assignee = getAssigneeName(member.id);
                            }}>{member.first_name + ' ' + member.last_name}</Dropdown.RadioItem
                        >
                    {/each}
                </Dropdown.Content>
            </Dropdown.Root>

            <TextInput name="created_on" disabled={true} bind:value={todoItem.created_on}
                >Created On</TextInput
            >
            <div>
                <span>Deadline</span>
                <Popover.Root openFocus>
                    <Popover.Trigger asChild let:builder>
                        <Button
                            variant="outline"
                            class={cn(
                                'w-[280px] justify-start text-left font-normal',
                                !deadline && 'text-muted-foreground'
                            )}
                            builders={[builder]}
                        >
                            <CalendarIcon class="mr-2 h-4 w-4" />
                            {deadline
                                ? df.format(deadline.toDate(getLocalTimeZone()))
                                : 'Select a date'}
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content class="w-auto p-0 bg-base-300">
                        <Calendar bind:value={deadline} initialFocus />
                    </Popover.Content>
                </Popover.Root>
                {#if deadline && deadline < today(getLocalTimeZone())}
                    <span>Deadline must be in the future</span>
                {/if}
            </div>
        </div>
    </div>
</div>
