<script>
    import { applyAction, enhance } from '$app/forms';
    import { receive, send } from '$lib/utils/helpers';
    import { scale } from 'svelte/transition';
    import IconTextInput from '$lib/components/IconTextInput.svelte';


    /**
     * @typedef {Object} Props
     * @property {import('./$types').ActionData} form
     */

    /** @type {Props} */
    let { form } = $props();

    /** @type {import('./$types').SubmitFunction} */
    const handleRegister = async () => {
        return async ({ result }) => {
            await applyAction(result);
        };
    };
</script>

<div>
    <form
        class="flex flex-col space-y-2 mt-4 m-2"
        action="?/register_house"
        method="POST"
        use:enhance={handleRegister}
    >
        {#if form?.errors}
            {#each form?.errors as error (error.id)}
                <h4
                    class="step-subtitle warning"
                    in:receive={{ key: error.id }}
                    out:send={{ key: error.id }}
                >
                    {error.error}
                </h4>
            {/each}
        {/if}

        <IconTextInput type="text" name="house_name" placeholder="Home name">
            <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
        </IconTextInput>
        {#if form?.fieldsError && form?.fieldsError.houseName}
            <p class="warning" transition:scale|local={{ start: 0.7 }}>
                {form?.fieldsError.houseName}
            </p>
        {/if}

        <div class="btn-container">
            <button class="btn btn-neutral btn-wide w-full"> Register </button>
        </div>
    </form>
</div>
