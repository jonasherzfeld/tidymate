<script lang="ts">
    import { enhance } from '$app/forms';
    import AvatarGraphic from '$lib/components/AvatarGraphic.svelte';
    import TextInput from '$lib/components/TextInput.svelte';
    import AvatarModal from '$lib/components/AvatarModal.svelte';
    import EditIcon from 'virtual:icons/mdi/file-edit-outline';
    import SubmitIcon from 'virtual:icons/mdi/file-send-outline';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { ActionData } from './$types';
    import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';

    import AttributeLabel from '$lib/components/AttributeLabel.svelte';

    let { data = $bindable() } = $props();
    let showModal = $state(false);
    let edit_email = $state(false);
    let edit_first_name = $state(false);
    let edit_last_name = $state(false);
    let is_img_hover = $state(false);
    let handleImgHover = (value: boolean) => {
        is_img_hover = value;
    };
    let handleEmail: TypedSubmitFunction<ActionData>  = async () => {
        return async ({ update }) => {
            await update();
            edit_email = false;
        };
    };
    let handleFirstName: TypedSubmitFunction<ActionData>  = async () => {
        return async ({ update }) => {
            await update();
            edit_first_name = false;
        };
    };
    let handleLastName: TypedSubmitFunction<ActionData> = async () => {
        return async ({ update }) => {
            await update();
            edit_last_name = false;
        };
    };
</script>

<div class="grid bg-base-200 min-h-screen w-full items-start justify-center">
    <div class="grid justify-center text-center max-w-xl m-2 mt-10">
        <div class="flex justify-center items-center gap-5">
            <div class="relative text-center">
                <div class="avatar"
                        role="img"
                        onmouseenter={() => {
                            handleImgHover(true);
                        }}
                        onmouseleave={() => {
                            handleImgHover(false);
                        }}>
                        <button onclick={() => (showModal = true)}>
                    <AvatarGraphic thumbnail={data.user.thumbnail} height="h-24" width="w-24" text_size="text-5xl font-bold">
                            <div
                                class="w-full absolute bottom-0 left-0 text-center h-6 bg-white bg-opacity-60"
                                aria-label="Change Avatar"
                                style="display: {is_img_hover ? 'block' : 'none'}"
                            >
                                <h2 class="text-sm text-base-300">Change</h2>
                            </div>
                    </AvatarGraphic>
                </button>

                </div>
            </div>

            <h1 class="text-5xl text-center font-bold">Hi, {data.user.first_name}!</h1>
        </div>
        <p class="py-6">This is your profile page. Here you can see your details.</p>

        <div class="grid gap-2">
            <form action="?/update_user" method="POST" use:enhance={handleEmail}>
                <div class="flex gap-2">
                    <AttributeLabel is_change_mode={edit_email} name="email_name" desc_text="Email" bind:label_text={data.user.email}>
                    {#if edit_email}
                        <button type="submit" class="btn join-item bg-base-300" disabled>
                            <SubmitIcon style="font-size:1.2em" />
                        </button>
                    {:else}
                        <button
                            type="button"
                            class="btn join-item bg-base-300"
                            onclick={() => {
                                edit_email = true;
                            }}
                            disabled>
                            <EditIcon style="font-size:1.2em" />
                        </button>
                    {/if}
                    </AttributeLabel>
                </div>
            </form>
            <form  action="?/update_user" method="POST" use:enhance={handleFirstName}>
                <AttributeLabel is_change_mode={edit_first_name} name="first_name" desc_text="First Name" bind:label_text={data.user.first_name}>
                    {#if edit_first_name}
                        <button type="submit" class="btn join-item bg-base-3000">
                            <SubmitIcon style="font-size:1.2em" />
                        </button>

                    {:else}
                        <button
                            type="button"
                            class="btn join-item bg-base-300"
                            onclick={() => {
                                edit_first_name = true;
                            }}
                        >
                            <EditIcon style="font-size:1.2em" />
                        </button>
                    {/if}
                </AttributeLabel>
            </form>
            <form action="?/update_user" method="POST" use:enhance={handleLastName}>
                <div class="flex gap-2">
                    <AttributeLabel is_change_mode={edit_last_name} name="last_name" desc_text="Last Name" bind:label_text={data.user.last_name}>
                    {#if edit_last_name}
                        <button type="submit" class="btn join-item bg-base-300">
                            <SubmitIcon style="font-size:1.2em" />
                        </button>
                    {:else}
                        <button
                            type="button"
                            class="btn join-item bg-base-300"
                            onclick={() => {
                                edit_last_name = true;
                            }}
                        >
                            <EditIcon style="font-size:1.2em" />
                        </button>
                    {/if}
                    </AttributeLabel>
                </div>
            </form>
            <TextInput name="joined_on" value={data.user.joined_on} disabled={true}
                ><b>Joined On</b>
            </TextInput>
            <ThemeSwitch />
        </div>
        <AvatarModal bind:showModal>
            <div class="flex flex-col sm:flex-row items-center gap-3 mb-5">
                <div class="avatar m-5">
                    <AvatarGraphic thumbnail={data.user.thumbnail} height="h-24" width="w-24" text_size="text-5xl font-bold"/>
                </div>
                <div>
                    <form method="POST" use:enhance enctype="multipart/form-data">
                        <label class="form-control w-full max-w-xs mb-4">
                            <input
                                type="file"
                                name="file"
                                class="file-input file-input-bordered w-full max-w-xs"
                                accept=".jpg, .jpeg, .png, .webp"
                            />
                        </label>
                        <div class="grid sm:grid-cols-2 gap-3">
                            <button
                                class="btn"
                                type="submit"
                                formaction="?/upload_image"
                                disabled={data.user.thumbnail}>Upload image</button
                            >
                            <button
                                class="btn btn-error"
                                formaction="?/delete_image"
                                type="submit"
                                disabled={!data.user.thumbnail}
                            >
                                Remove image
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AvatarModal>
    </div>
</div>
