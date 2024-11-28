<script lang="ts">
    import MenuDots from 'virtual:icons/mdi/dots-vertical';
    import { enhance } from '$app/forms';
    import Dropdown from './dropdown/Dropdown.svelte';
    import DropdownContent from './dropdown/DropdownContent.svelte';
    import DropdownButton from './dropdown/DropdownTrigger.svelte';
    import DropdownActionItem from './dropdown/DropdownActionItem.svelte';
    import DropdownLinkItem from './dropdown/DropdownLinkItem.svelte';

    let {
        id = $bindable(),
        data = $bindable(),
        assignee = $bindable(),
        done = $bindable(),
        tags = $bindable(),
        createdOn = $bindable(),
        deadline = $bindable(),
        removedList = $bindable()
    }: {
        id: string;
        data: string;
        assignee: string;
        done: boolean;
        tags: string[];
        createdOn: string;
        deadline: string;
        removedList: string[];
    } = $props();

    let createdOnDate = new Date(createdOn);
    let deadlineDate = new Date(deadline);

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
                removedList.push(result.data.todo_id);
            } else {
                await update();
            }
        };
    };
</script>

<div class="flex w-full">
    <div
        class="card rounded-lg flex flex-row p-2 justify-between items-start w-full bg-base-200 h-fit"
    >
        <div class="flex justify-start w-fit h-full">
            <form
                class="flex"
                action="/home/todo?/check_todo&id={id}"
                method="POST"
                use:enhance={handleChecked}
            >
                <input
                    type="checkbox"
                    name="check_todo"
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
                    <span class="justify-left w-fit pr-3 text-xs text-warning"
                        >{deadlineDate.toLocaleDateString('en-GB')}</span
                    >
                {/if}
                {#if assignee}
                    <h2 class="card-compact text-xs">
                        {assignee ? assignee : 'Not assigned'}
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
                    <DropdownLinkItem href="/home/todo/{id}">Edit</DropdownLinkItem>
                    <form method="POST" use:enhance={handleRemove}>
                        <DropdownActionItem action="/home/todo?/delete_todo&id={id}"
                            >Delete</DropdownActionItem
                        >
                    </form>
                </DropdownContent>
            </Dropdown>
        </div>
    </div>
</div>
