<script lang="ts">
    import { enhance } from '$app/forms';
    import TextInput from '$lib/components/TextInput.svelte';
    import JoinIdCreator from '$lib/components/JoinIdCreator.svelte';
    import HouseMemberTable from '$lib/components/HouseMemberTable.svelte';
    import AttributeLabel from '$lib/components/AttributeLabel.svelte';
    import EditIcon from 'virtual:icons/mdi/file-edit-outline';
    import SubmitIcon from 'virtual:icons/mdi/file-send-outline';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { ActionData } from './$types';

    let { data = $bindable() } = $props();

    let edit_name = $state(false);
    let edit_country = $state(false);
    let edit_city = $state(false);
    let handleName: TypedSubmitFunction<ActionData>  = async () => {
        return async ({ update }) => {
            await update();
            edit_name = false;
        };
    };
    let handleCountry: TypedSubmitFunction<ActionData>  = async () => {
        return async ({ update }) => {
            await update();
            edit_country = false;
        };
    };
    let handleCity: TypedSubmitFunction<ActionData>  = async () => {
        return async ({ update }) => {
            await update();
            edit_city = false;
        };
    };

</script>

<div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
        <div class="grid gap-2 max-w-md">
            <h1 class="text-5xl font-bold">{data.house.name}</h1>
            <p class="py-6">This is the settings page for your house!</p>
            <form action="?/update_house" method="POST" use:enhance={handleName}>
                <AttributeLabel is_change_mode={edit_name} name="name" desc_text="Name" bind:label_text={data.house.name}>
                    {#if edit_name}
                        <button type="submit" class="btn join-item bg-base-300" >
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
                <AttributeLabel is_change_mode={edit_city} name="city" desc_text="City" bind:label_text={data.house.city}>
                    {#if edit_city}
                        <button type="submit" class="btn join-item bg-base-300" >
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
                <AttributeLabel is_change_mode={edit_country} name="country" desc_text="Country" bind:label_text={data.house.country}>
                    {#if edit_country}
                        <button type="submit" class="btn join-item bg-base-300" >
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

            <HouseMemberTable user_list={data.user_list} change_enabled={data.user.is_admin} />
            {#if data.user.is_admin}
                <JoinIdCreator />
            {/if}
        </div>
    </div>
</div>
