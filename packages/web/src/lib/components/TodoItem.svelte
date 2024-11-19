<script lang="ts">
    import MenuDots from 'virtual:icons/mdi/dots-vertical';
    import { enhance } from '$app/forms';

    let {
        form,
        id = $bindable(),
        data = $bindable(),
        assignee = $bindable(),
        done = $bindable(),
        tags = $bindable(),
        created_on = $bindable(),
        deadline = $bindable(),
        removedList = $bindable(),
        border = false
    }: {
        form?: HTMLFormElement;
        id: string;
        data: string;
        assignee: string;
        done: boolean;
        tags: string[];
        created_on: string;
        deadline: string;
        removedList: string[];
        border?: boolean;
    } = $props();
    let date = new Date(created_on);

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
                update();
            }
        };
    };
</script>

<div class="flex w-full">
    <div
        class={`card rounded-lg flex flex-row p-2 justify-between items-start w-full bg-base-200 ${border ? 'border-t-2 border-neutral-400' : ''} h-fit`}
    >
        <div class="flex justify-start w-fit h-full">
            <form
                bind:this={form}
                class="flex"
                action="/home/todo?/check_todo&id={id}"
                method="POST"
                use:enhance={handleChecked}
            >
                <input
                    type="checkbox"
                    name="check_todo"
                    class="checkbox checkbox-primary checkbox-md"
                    onchange={() => form.requestSubmit()}
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
                    <span class="justify-left w-fit pr-3 text-xs"
                        >{date.toLocaleDateString('en-GB')}</span
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
            <div class="dropdown dropdown-bottom dropdown-end">
                <div
                    tabindex="0"
                    role="button"
                    class="btn btn-xs btn-square btn-outline rounded-md border-neutral-700"
                >
                    <MenuDots />
                </div>
                <ul
                    tabindex="-1"
                    class="dropdown-content menu bg-base-100 rounded-box z-[1] w-24 p-2 shadow"
                >
                    <li><a href="/home/todo/{id}">Edit</a></li>
                    <form method="POST" use:enhance={handleRemove}>
                        <li>
                            <button
                                type="submit"
                                class="text-error"
                                formaction="/home/todo?/delete_todo&id={id}">Delete</button
                            >
                        </li>
                    </form>
                </ul>
            </div>
        </div>
    </div>
</div>
