<script lang="ts">
    import TextInput from '$lib/components/TextInput.svelte';
    import HouseMemberItem from '$lib/components/HouseMemberItem.svelte';
    import AttributeLabel from '$lib/components/AttributeLabel.svelte';
    import EditIcon from 'virtual:icons/mdi/file-edit-outline';
    import SubmitIcon from 'virtual:icons/mdi/file-send-outline';
    import { superForm } from 'sveltekit-superforms';

    let { data = $bindable() } = $props();
    const {
        form: name_form,
        errors: name_errors,
        enhance: name_enhance,
        message: name_message
    } = superForm(data.name_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_name = true;
        },
        onUpdate: async ({ form }) => {
            if (form.valid) {
                edit_name = false;
            } else {
                edit_name = true;
            }
            creating_name = false;
        }
    });

    const {
        form: city_form,
        errors: city_errors,
        enhance: city_enhance,
        message: city_message
    } = superForm(data.city_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_city = true;
        },
        onUpdate: async ({ form }) => {
            if (form.valid) {
                edit_city = false;
            } else {
                edit_city = true;
            }
            creating_city = false;
        }
    });

    const {
        form: country_form,
        errors: country_errors,
        enhance: country_enhance,
        message: country_message
    } = superForm(data.country_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_country = true;
        },
        onUpdate: async ({ form }) => {
            if (form.valid) {
                edit_country = false;
            } else {
                edit_country = true;
            }
            creating_country = false;
        }
    });

    const {
        form: joinid_form,
        errors: joinid_errors,
        enhance: joinid_enhance,
        message: joinid_message
    } = superForm(data.joinid_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_join_id = true;
        },
        onUpdate: async ({ form, result }) => {
            const action = result.data;
            if (form.valid) {
                join_id_value = action.join_id;
            }
            creating_join_id = false;
        }
    });

    let edit_name = $state(false);
    let edit_country = $state(false);
    let edit_city = $state(false);
    let creating_name = $state(false);
    let creating_country = $state(false);
    let creating_city = $state(false);
    let creating_join_id = $state(false);
    let join_id_value = $state(data.house.join_id);
    let is_active_join_id = $derived(join_id_value);
</script>

<div class="flex flex-col flex-1 min-w-full">
    <h1 class="text-5xl font-bold">{$name_form?.name? $name_form.name : data.house.name}</h1>
    <p class="py-4">This is the settings page for your house!</p>
    <div class="flex flex-col flex-1 gap-3 min-w-full">
        <div class="flex flex-col flex-1 gap-2 p-3 card bg-base-100">
            <form action="?/update_name" method="POST" use:name_enhance>
                {#if $name_errors.name}<span class="invalid">{$name_errors.name}</span>{/if}
                <AttributeLabel
                    is_change_mode={edit_name}
                    name="name"
                    desc_text="Name"
                    bind:label_text={$name_form.name}
                >
                    {#if edit_name}
                        <button
                            type="submit"
                            class="btn join-item btn-primary"
                            disabled={creating_name}
                        >
                            {#if !creating_name}
                                <SubmitIcon style="font-size:1.2em" />
                            {:else}
                                <span class="loading loading-spinner loading-sm"></span>
                            {/if}
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
            <form action="?/update_city" method="POST" use:city_enhance>
                {#if $city_errors.city}<span class="invalid">{$city_errors.city}</span>{/if}
                <AttributeLabel
                    is_change_mode={edit_city}
                    name="city"
                    desc_text="City"
                    bind:label_text={$city_form.city}
                >
                    {#if edit_city}
                        <button
                            type="submit"
                            class="btn join-item btn-primary"
                            disabled={creating_city}
                        >
                            {#if !creating_city}
                                <SubmitIcon style="font-size:1.2em" />
                            {:else}
                                <span class="loading loading-spinner loading-sm"></span>
                            {/if}
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
            <form action="?/update_country" method="POST" use:country_enhance>
                {#if $country_errors.country}<span class="invalid">{$country_errors.country}</span
                    >{/if}
                <AttributeLabel
                    is_change_mode={edit_country}
                    name="country"
                    desc_text="Country"
                    bind:label_text={$country_form.country}
                >
                    {#if edit_country}
                        <button
                            type="submit"
                            class="btn join-item btn-primary"
                            disabled={creating_country}
                        >
                            {#if !creating_country}
                                <SubmitIcon style="font-size:1.2em" />
                            {:else}
                                <span class="loading loading-spinner loading-sm"></span>
                            {/if}
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
            <div>
                <h2 class="mt-5 mb-2">Invite friends to your house</h2>
                <form action="?/toggle_join_id" method="POST" use:joinid_enhance>
                    <div class="join">
                        <input
                            disabled={creating_join_id}
                            id="npm-install-copy-button"
                            class="input input-bordered join-item"
                            value={join_id_value}
                        />
                        <button
                            class="btn join-item rounded-r-full btn-primary border-none"
                            disabled={creating_join_id || !data.user.is_admin}
                        >
                            {#if !creating_join_id}
                                {is_active_join_id ? 'Delete' : 'Create'}
                            {:else}
                                <span class="loading loading-spinner loading-lg"></span>
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        {/if}
    </div>
</div>
