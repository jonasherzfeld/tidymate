<script lang="ts">
    import MenuDots from 'virtual:icons/mdi/dots-vertical';
    import { enhance } from '$app/forms';

    let { todo = $bindable(), removedList = $bindable() }: { todo: Todo; removedList: string[] } =
        $props();
    let date = new Date(todo.created_on);

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
        class={`card rounded-md shadow-sm flex flex-row p-2 justify-between items-center w-full bg-base-100 border border-neutral-400`}
    >
        <div class="flex justify-left w-fit items-center h-full">
            <input
                type="checkbox"
                class="checkbox checkbox-primary checkbox-md"
                formaction="/home/todo?/delete_todo&id={todo.id}"
                checked={todo.done}
            />
        </div>
        <div class="justify-left text-left grow pl-2 pr-2 pt-0 mt-0 h-fit">
            <h2 class="flex items-start pt-0 mt-0 font-semibold">{todo.data}</h2>
            <div class="flex">
                <span class="justify-left w-fit pr-3 text-xs"
                    >{date.toLocaleDateString('en-GB')}</span
                >
                <h2 class="card-compact text-xs">
                    {todo.assignee ? todo.assignee : 'Not assigned'}
                </h2>
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
                    <li><a href="/home/todo/{todo.id}">Edit</a></li>
                    <form method="POST" use:enhance={handleRemove}>
                        <li>
                            <button
                                type="submit"
                                class="text-error"
                                formaction="/home/todo?/delete_todo&id={todo.id}">Delete</button
                            >
                        </li>
                    </form>
                </ul>
            </div>
        </div>
    </div>
</div>
