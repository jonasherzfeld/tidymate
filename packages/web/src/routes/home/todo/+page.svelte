<script lang="ts">
    import TodoItem from '$lib/components/TodoItem.svelte';

    let { data } = $props();
</script>

<div class="flex flex-col flex-1 min-w-full">
    <h1 class="text-5xl font-bold text-accent mb-6">To-Dos</h1>
    <div class="flex flex-col flex-1 gap-3 min-w-full">
        <div class=" flex flex-col flex-1 gap-2 p-3 card bg-base-300">
            {#await data.streamed.todo_list}
                <div class="flex w-full flex-col gap-4">
                    <div class="skeleton h-32 w-full"></div>
                    <div class="skeleton h-4 w-28"></div>
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-full"></div>
                </div>
            {:then todo_list}
                {#each todo_list as todo}
                    <TodoItem {todo} />
                {/each}
            {:catch error}
                <p>{error.message}</p>
            {/await}
        </div>
    </div>
</div>
