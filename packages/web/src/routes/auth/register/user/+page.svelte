<script>
    import { applyAction, enhance } from '$app/forms';
    import { receive, send } from '$lib/utils/helpers';
    import { create_group } from '$lib/utils/stores';
    import { scale } from 'svelte/transition';
    import IconTextInput from '$lib/components/IconTextInput.svelte';

    let create_group_value;
    create_group.subscribe((value) => {
        create_group_value = value;
    });
    console.log(create_group_value);

    /** @type {import('./$types').ActionData} */
    export let form;

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
        action="?/register"
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

        <IconTextInput type="text" name="email" class_in="grow" placeholder="Email">
            <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
        </IconTextInput>
        {#if form?.fieldsError && form?.fieldsError.email}
            <p class="warning" transition:scale|local={{ start: 0.7 }}>
                {form?.fieldsError.email}
            </p>
        {/if}

        <IconTextInput type="text" name="first_name" class_in="grow" placeholder="First name" />
        <IconTextInput type="text" name="last_name" class_in="grow" placeholder="Last name" />
        <IconTextInput type="password" name="password" class_in="grow" placeholder="Password">
            <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
            />
        </IconTextInput>
        {#if form?.fieldsError && form?.fieldsError.password}
            <p class="warning" transition:scale|local={{ start: 0.7 }}>
                {form?.fieldsError.password}
            </p>
        {/if}

        <IconTextInput
            type="password"
            name="confirm_password"
            class_in="grow"
            placeholder="Confirm Password"
        >
            <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
            />
        </IconTextInput>
        {#if form?.fieldsError && form?.fieldsError.confirmPassword}
            <p class="warning" transition:scale|local={{ start: 0.7 }}>
                {form?.fieldsError.confirmPassword}
            </p>
        {/if}

        {#if !create_group_value}
            <IconTextInput type="text" name="join_id" class_in="grow" placeholder="Home ID" />
            {#if form?.fieldsError && form?.fieldsError.joinId}
                <p class="warning" transition:scale|local={{ start: 0.7 }}>
                    {form?.fieldsError.joinId}
                </p>
            {/if}
        {/if}

        <div class="btn-container">
            <button class="btn btn-neutral btn-wide w-full">
                {#if !create_group_value}
                    Register
                {:else}
                    Continue
                {/if}
            </button>
        </div>
    </form>
</div>
