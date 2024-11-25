<script lang="ts">
    import TextInput from '$lib/components/TextInput.svelte';
    import HouseMemberItem from '$lib/components/HouseMemberItem.svelte';
    import FormTextInput from '$lib/components/FormTextInput.svelte';
    import JoinIdCreator from '$lib/components/JoinIdCreator.svelte';
    import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const {
        form: name_form,
        errors: name_errors,
        enhance: name_enhance
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

    const { errors: city_errors, enhance: city_enhance } = superForm(data.city_form, {
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

    const { errors: country_errors, enhance: country_enhance } = superForm(data.country_form, {
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

    let server_errors: string = $state('');
    let edit_name: boolean = $state(false);
    let edit_country: boolean = $state(false);
    let edit_city: boolean = $state(false);
    let creating_name: boolean = $state(false);
    let creating_country: boolean = $state(false);
    let creating_city: boolean = $state(false);
</script>

<div class="flex flex-col flex-1 min-w-full">
    <h1 class="text-5xl font-bold text-accent">{$name_form.name}</h1>
    <p class="py-4">This is the settings page for your house!</p>
    <div class="flex flex-col flex-1 gap-3 min-w-full">
        <div class="flex flex-col flex-1 gap-2 p-3 card bg-base-200">
            <form action="?/update_name" method="POST" use:name_enhance>
                <FormTextInput
                    superform={data.name_form}
                    field="name"
                    label="Name"
                    bind:edit_value={edit_name}
                    bind:creating_value={creating_name}
                />
                {#if $name_errors.name}<span class="invalid text-error">{$name_errors.name}</span
                    >{/if}
            </form>
            <form action="?/update_city" method="POST" use:city_enhance>
                <FormTextInput
                    superform={data.city_form}
                    field="city"
                    label="City"
                    bind:edit_value={edit_city}
                    bind:creating_value={creating_city}
                />
                {#if $city_errors.city}<span class="invalid text-error">{$city_errors.city}</span
                    >{/if}
            </form>
            <form action="?/update_country" method="POST" use:country_enhance>
                <FormTextInput
                    superform={data.country_form}
                    field="country"
                    label="Country"
                    bind:edit_value={edit_country}
                    bind:creating_value={creating_country}
                />
                {#if $country_errors.country}<span class="invalid text-error"
                        >{$country_errors.country}</span
                    >{/if}
            </form>
            <TextInput name="joined_on" value={data.house.created_on} disabled={true}
                ><b>Created On</b>
            </TextInput>
        </div>

        <div class="flex flex-col flex-1 gap-2 p-3 card bg-base-200">
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
            <JoinIdCreator bind:server_errors />
            {#if server_errors}
                <span class="invalid text-error">{server_errors}</span>
            {/if}
        {/if}
    </div>
</div>
