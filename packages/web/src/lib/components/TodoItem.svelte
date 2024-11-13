<script lang="ts">
    let { todo = $bindable() }: { todo: Todo } = $props();
</script>

<div class="flex join w-full">
    <div
        class={`card flex flex-row pt-5 pb-5 justify-between items-center w-full bg-neutral text-base-300`}
    >
        <div class="justify-left w-24">
            <input type="checkbox" class="checkbox-accent checkbox-md" bind:checked={todo.done} />
        </div>
        <div class="justify-left text-left grow">
            <h2 class="card-title">{todo.data}</h2>
            <h2 class="card-compact">{todo.assignee ? todo.assignee : 'Not assigned'}</h2>
            <h2 class="card-compact">Tags</h2>
        </div>
        <div class="justify-left w-24 pr-3">
            <span class="justify-left w-24 pr-3">DATE</span>
            <a href="/home/todo/{todo.id}"><button class="btn btn-primary">Open</button></a>
            <button class="btn btn-error" formaction="/home/todo?/delete_todo&id={todo.id}"
                >Delete</button
            >
        </div>
    </div>
</div>
