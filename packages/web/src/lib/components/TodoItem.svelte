<script lang="ts">
    let { todo = $bindable() }: { todo: Todo } = $props();
    let date = new Date(todo.created_on);
</script>

<div class="flex w-full">
    <div
        class={`card shadow-xl flex flex-row pt-5 pb-5 justify-between items-center w-full bg-base-300 border border-neutral`}
    >
        <div class="justify-left w-24">
            <input type="checkbox" class="checkbox-accent checkbox-md" bind:checked={todo.done} />
        </div>
        <div class="justify-left text-left grow">
            <h2 class="card-title">{todo.data}</h2>
            <div class="flex">
                <span class="justify-left w-24 pr-3">{date.toLocaleDateString('en-GB')}</span>
                <h2 class="card-compact">Tags</h2>
            </div>
        </div>
        <div class="justify-left w-24 pr-3">
            <a href="/home/todo/{todo.id}"><button class="btn btn-primary">Open</button></a>
            <!-- <button class="btn btn-error" formaction="/home/todo?/delete_todo&id={todo.id}"
                >Delete</button
            > -->
        </div>
    </div>
</div>
