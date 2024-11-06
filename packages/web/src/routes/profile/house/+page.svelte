<script lang="ts">
    import { enhance } from '$app/forms';
    import TextInput from '$lib/components/TextInput.svelte';
    import JoinIdCreator from '$lib/components/JoinIdCreator.svelte';
    import HouseMemberItem from '$lib/components/HouseMemberItem.svelte';
    import AttributeLabel from '$lib/components/AttributeLabel.svelte';
    import EditIcon from 'virtual:icons/mdi/file-edit-outline';
    import SubmitIcon from 'virtual:icons/mdi/file-send-outline';
    import type { TypedSubmitFunction } from '$lib/form';
    import type { ActionData } from './$types';

    let { data = $bindable() } = $props();

    let edit_name = $state(false);
    let edit_country = $state(false);
    let edit_city = $state(false);
    let handleName: TypedSubmitFunction<ActionData> = async () => {
        return async ({ update }) => {
            await update();
            edit_name = false;
        };
    };
    let handleCountry: TypedSubmitFunction<ActionData> = async () => {
        return async ({ update }) => {
            await update();
            edit_country = false;
        };
    };
    let handleCity: TypedSubmitFunction<ActionData> = async () => {
        return async ({ update }) => {
            await update();
            edit_city = false;
        };
    };
</script>

<div class="flex flex-col flex-1 min-w-full">
    <h1 class="text-5xl font-bold">{data.house.name}</h1>
    <p class="py-4">This is the settings page for your house!</p>

    <div class="flex flex-col flex-1 gap-3 min-w-full">
    <div class="flex flex-col flex-1 gap-2 p-3 card bg-base-100">
        <form action="?/update_house" method="POST" use:enhance={handleName}>
            <AttributeLabel
                is_change_mode={edit_name}
                name="name"
                desc_text="Name"
                bind:label_text={data.house.name}
            >
                {#if edit_name}
                    <button type="submit" class="btn join-item bg-base-300">
                        <SubmitIcon style="font-size:1.2em" />
                    </button>
                {:else}
                    <button
                        type="button"
                        class="btn join-item bg-base-300"
                        onclick={() => {
                            edit_name = true;
                        }}
                    >
                        <EditIcon style="font-size:1.2em" />
                    </button>
                {/if}
            </AttributeLabel>
        </form>
        <form action="?/update_house" method="POST" use:enhance={handleCity}>
            <AttributeLabel
                is_change_mode={edit_city}
                name="city"
                desc_text="City"
                bind:label_text={data.house.city}
            >
                {#if edit_city}
                    <button type="submit" class="btn join-item bg-base-300">
                        <SubmitIcon style="font-size:1.2em" />
                    </button>
                {:else}
                    <button
                        type="button"
                        class="btn join-item bg-base-300"
                        onclick={() => {
                            edit_city = true;
                        }}
                    >
                        <EditIcon style="font-size:1.2em" />
                    </button>
                {/if}
            </AttributeLabel>
        </form>
        <form action="?/update_house" method="POST" use:enhance={handleCountry}>
            <AttributeLabel
                is_change_mode={edit_country}
                name="country"
                desc_text="Country"
                bind:label_text={data.house.country}
            >
                {#if edit_country}
                    <button type="submit" class="btn join-item bg-base-300">
                        <SubmitIcon style="font-size:1.2em" />
                    </button>
                {:else}
                    <button
                        type="button"
                        class="btn join-item bg-base-300"
                        onclick={() => {
                            edit_country = true;
                        }}
                    >
                        <EditIcon style="font-size:1.2em" />
                    </button>
                {/if}
            </AttributeLabel>
        </form>
        <TextInput name="joined_on" value={data.house.created_on} disabled={true}
            ><b>Created On</b>
        </TextInput>
    </div>

    <div class="flex flex-col flex-1 gap-2 p-3 card bg-base-100">
        <h2 class="m-4 text-xl font-bold">House Members</h2>
        {#await data.streamed.user_list}
            <div class="flex w-full flex-col gap-4">
                <div class="skeleton h-32 w-full"></div>
                <div class="skeleton h-4 w-28"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
            </div>
        {:then user_list}
            <table class="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Joined On</th>
                        <th>Admin</th>
                    </tr>
                </thead>
                <tbody>
                    {#each user_list as user}
                        <HouseMemberItem
                            user_id={user.id}
                            first_name={user.first_name}
                            last_name={user.last_name}
                            is_admin={user.is_admin}
                            joined_on={user.joined_on}
                            src={user.thumbnail ? user.thumbnail : ''}
                            change_enabled={data.user.is_admin}
                        />
                    {/each}
                </tbody>
            </table>
        {/await}
    </div>

    {#if data.user.is_admin}
        <JoinIdCreator />
    {/if}
    </div>
</div>
