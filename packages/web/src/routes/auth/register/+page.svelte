<script>
    import { applyAction, enhance } from '$app/forms';
    import { receive, send } from '$lib/utils/helpers';
    import { scale } from 'svelte/transition';
    import TextInput from '$lib/components/TextInput.svelte';

    /**
     * @typedef {Object} Props
     * @property {import('./user/$types').ActionData} form
     */

    /** @type {Props} */
    let { form } = $props();

    let join_home = $state(true);

    /** @type {import('./user/$types').SubmitFunction} */
    const handleRegister = async () => {
        return async ({ result }) => {
            await applyAction(result);
        };
    };
</script>

<div>
    <div class="flex form- m-3">
        <input
            type="checkbox"
            class="toggle toggle-primary cursor-pointer"
            bind:checked={join_home}
        />
        <span class="label-text ml-3">Join an existing home</span>
    </div>
    <form
        class="flex flex-col space-y-2 mt-4 m-2"
        action="?/register"
        method="POST"
        use:enhance={handleRegister}
    >
        <input class="hidden" name="join_home" value={join_home} />

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

        <TextInput type="text" name="email" placeholder="Email">
            <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
        </TextInput>
        {#if form?.fieldsError && form?.fieldsError.email}
            <p class="warning" transition:scale|local={{ start: 0.7 }}>
                {form?.fieldsError.email}
            </p>
        {/if}

        <TextInput type="text" name="first_name" placeholder="First name" />
        <TextInput type="text" name="last_name" placeholder="Last name" />
        <TextInput type="password" name="password" placeholder="Password">
            <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
            />
        </TextInput>
        {#if form?.fieldsError && form?.fieldsError.password}
            <p class="warning" transition:scale|local={{ start: 0.7 }}>
                {form?.fieldsError.password}
            </p>
        {/if}

        <TextInput type="password" name="confirm_password" placeholder="Confirm Password">
            <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
            />
        </TextInput>
        {#if form?.fieldsError && form?.fieldsError.confirmPassword}
            <p class="warning" transition:scale|local={{ start: 0.7 }}>
                {form?.fieldsError.confirmPassword}
            </p>
        {/if}

        {#if join_home}
            <TextInput
                type="text"
                name="join_id"
                placeholder="Join ID"
                class_in="input input-bordered input-primary flex items-center gap-2"
            />
            {#if form?.fieldsError && form?.fieldsError.joinId}
                <p class="warning" transition:scale|local={{ start: 0.7 }}>
                    {form?.fieldsError.joinId}
                </p>
            {/if}
        {/if}

        <div class="btn-container">
            <button class="btn btn-neutral btn-wide w-full"
                >{!join_home ? 'Continue' : 'Register'}
            </button>
        </div>
    </form>
    <p>
        Already registered? <a href="/auth/login">Login here</a>.
    </p>
</div>
