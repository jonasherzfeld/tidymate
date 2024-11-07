<script lang="ts">
    import { enhance } from '$app/forms';
    import AvatarGraphic from '$lib/components/AvatarGraphic.svelte';
    import TextInput from '$lib/components/TextInput.svelte';
    import AvatarModal from '$lib/components/AvatarModal.svelte';
    import EditIcon from 'virtual:icons/mdi/file-edit-outline';
    import SubmitIcon from 'virtual:icons/mdi/file-send-outline';
    import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
    import AttributeLabel from '$lib/components/AttributeLabel.svelte';
    import { superForm } from 'sveltekit-superforms';

    let { data = $bindable() } = $props();
    let showModal = $state(false);

    let creating_email = $state(false);
    let creating_first_name = $state(false);
    let creating_last_name = $state(false);
    let edit_email = $state(false);
    let edit_first_name = $state(false);
    let edit_last_name = $state(false);
    let is_img_hover = $state(false);
    let handleImgHover = (value: boolean) => {
        is_img_hover = value;
    };

    const {
        form: email_form,
        errors: email_errors,
        enhance: email_enhance,
        message: email_message
    } = superForm(data.email_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_email = true;
        },
        onUpdate: async ({ form }) => {
            if (form.valid) {
                edit_email = false;
            } else {
                edit_email = true;
            }
            creating_email = false;
        }
    });

    const {
        form: first_name_form,
        errors: first_name_errors,
        enhance: first_name_enhance,
        message: first_name_message
    } = superForm(data.first_name_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_first_name = true;
        },
        onUpdate: async ({ form }) => {
            if (form.valid) {
                edit_first_name = false;
            } else {
                edit_first_name = true;
            }
            creating_first_name = false;
        }
    });

    const {
        form: last_name_form,
        errors: last_name_errors,
        enhance: last_name_enhance,
        message: last_name_message
    } = superForm(data.last_name_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_last_name = true;
        },
        onUpdate: async ({ form }) => {
            if (form.valid) {
                edit_last_name = false;
            } else {
                edit_last_name = true;
            }
            creating_last_name = false;
        }
    });
</script>

<div class="flex flex-col flex-1 min-w-full">
    <div class="flex justify-left sm:justify-center items-center ml-5 mr-2 gap-5">
        <div class="relative text-center">
            <div
                class="avatar"
                role="img"
                onmouseenter={() => {
                    handleImgHover(true);
                }}
                onmouseleave={() => {
                    handleImgHover(false);
                }}
            >
                <button onclick={() => (showModal = true)}>
                    <AvatarGraphic
                        thumbnail={data.user.thumbnail}
                        height="h-24"
                        width="w-24"
                        text_size="text-5xl font-bold"
                    >
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

        <h1 class="text-4xl text-center font-bold">Hi, {$first_name_form.first_name}!</h1>
    </div>
    <p class="py-6">This is your profile page. Here you can see your details.</p>

    <div class="flex flex-col flex-1 gap-2 p-3 card bg-base-100">
        <form action="?/update_email" method="POST" use:email_enhance>
                {#if $email_errors.email}<span class="invalid">{$email_errors.email}</span>{/if}
                <AttributeLabel
                    is_change_mode={edit_email}
                    name="email_name"
                    desc_text="Email"
                    bind:label_text={$email_form.email}
                >
                    {#if edit_email}
                        <button
                            type="submit"
                            class="btn join-item btn-primary"
                            disabled={creating_email}
                        >
                            {#if !creating_email}
                                <SubmitIcon style="font-size:1.2em" />
                            {:else}
                                <span class="loading loading-spinner loading-sm"></span>
                            {/if}
                        </button>
                    {:else}
                        <button
                            type="button"
                            class="btn join-item bg-base-300"
                            disabled={true}
                            onclick={() => {
                                edit_email = true;
                            }}
                        >
                            <EditIcon style="font-size:1.2em" />
                        </button>
                    {/if}
                </AttributeLabel>
        </form>
        <form action="?/update_first_name" method="POST" use:first_name_enhance>
            {#if $first_name_errors.first_name}<span class="invalid">{$first_name_errors.first_name}</span>{/if}
            <AttributeLabel
                is_change_mode={edit_first_name}
                name="first_name"
                desc_text="First Name"
                bind:label_text={$first_name_form.first_name}
            >
                {#if edit_first_name}
                    <button
                        type="submit"
                        class="btn join-item btn-primary"
                        disabled={creating_first_name}
                    >
                        {#if !creating_first_name}
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
                            edit_first_name = true;
                        }}
                    >
                        <EditIcon style="font-size:1.2em" />
                    </button>
                {/if}
            </AttributeLabel>
        </form>
        <form action="?/update_last_name" method="POST" use:last_name_enhance>
            <div class="flex gap-2">
                {#if $last_name_errors.last_name}<span class="invalid">{$last_name_errors.last_name}</span>{/if}
                <AttributeLabel
                    is_change_mode={edit_last_name}
                    name="last_name"
                    desc_text="Last Name"
                    bind:label_text={$last_name_form.last_name}
                >
                    {#if edit_last_name}
                        <button
                            type="submit"
                            class="btn join-item btn-primary"
                            disabled={creating_last_name}
                        >
                            {#if !creating_last_name}
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
</div>
<AvatarModal bind:showModal>
    <div class="flex flex-col sm:flex-row items-center gap-3 mb-5">
        <div class="avatar m-5">
            <AvatarGraphic
                thumbnail={data.user.thumbnail}
                height="h-24"
                width="w-24"
                text_size="text-5xl font-bold"
            />
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
