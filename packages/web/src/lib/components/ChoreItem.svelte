<script lang="ts">
    import { MenuDots } from '$lib/utils/icons';
    import { enhance } from '$app/forms';
    import Dropdown from './dropdown/Dropdown.svelte';
    import DropdownContent from './dropdown/DropdownContent.svelte';
    import DropdownButton from './dropdown/DropdownTrigger.svelte';
    import DropdownActionItem from './dropdown/DropdownActionItem.svelte';
    import DropdownLinkItem from './dropdown/DropdownLinkItem.svelte';
    import { getUsernameById } from '$lib/utils/helpers';
    import { page } from '$app/stores';
    import { cn } from '$lib/utils';

    let {
        id = $bindable(),
        data = $bindable(),
        assignee = $bindable(),
        done = $bindable(),
        tags = $bindable(),
        created_on = $bindable(),
        deadline = $bindable(),
        removedList = $bindable()
    }: {
        id: string;
        data: string;
        assignee: string;
        done: boolean;
        tags: string[];
        created_on: string;
        deadline: string;
        removedList: string[];
    } = $props();

    let assigneeName = $derived(getUsernameById(assignee, $page.data.house.members));

    let deadlineDate: Date = $derived(new Date(deadline));
    let deadlineWarningDate: Date = new Date();
    deadlineWarningDate.setDate(new Date().getDate() + 1);
    let deadlineErrorDate: Date = new Date();
    deadlineErrorDate.setDate(new Date().getDate() + 0);

    const handleChecked = async ({}) => {
        return async ({ result, update }) => {
            if (result.status !== 200) {
                update();
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
        class="card card-bordered border-neutral rounded-lg flex flex-row p-2 justify-between items-start w-full bg-base-300 shadow-sm h-fit"
    >
        <div class="flex justify-start w-fit h-full">
            <form
                class="flex"
                action="/home/chores?/check_chore&id={id}"
                method="POST"
                use:enhance={handleChecked}
            >
                <input
                    type="checkbox"
                    name="check_chore"
                    class="checkbox checkbox-primary checkbox-md"
                    onchange={(e) => {
                        e.target.form.requestSubmit();
                    }}
                    bind:checked={done}
                />
            </form>
        </div>

        <div class="justify-left text-left grow pl-4 pr-2 pt-0 mt-0 h-fit">
            <h2 class={`flex items-start pt-0 mt-0 ${done ? 'text-primary' : ''}`}>
                {data}
            </h2>

            <div class="flex">
                {#if deadline}
                    <span
                        class={cn(
                            'justify-left w-fit pr-3 text-xs text-info',
                            deadlineDate <= deadlineWarningDate && 'text-warning',
                            deadlineDate <= deadlineErrorDate && 'text-error'
                        )}>{deadlineDate.toDateString()}</span
                    >
                {/if}
                {#if assigneeName}
                    <h2 class="card-compact text-xs">
                        {assigneeName}
                    </h2>
                {/if}
            </div>
        </div>
        <div class="flex justify-end w-fit h-full">
            <Dropdown>
                <DropdownButton className="btn-xs btn-square">
                    <MenuDots />
                </DropdownButton>
                <DropdownContent>
                    <DropdownLinkItem href="/home/chores/{id}">Edit</DropdownLinkItem>
                    <form method="POST" use:enhance={handleRemove}>
                        <DropdownActionItem action="/home/chores?/delete_chore&id={id}"
                            >Delete</DropdownActionItem
                        >
                    </form>
                </DropdownContent>
            </Dropdown>
        </div>
    </div>
</div>
