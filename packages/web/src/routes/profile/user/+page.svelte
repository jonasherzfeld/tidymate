<script lang="ts">
    import { enhance } from '$app/forms';
    import AvatarGraphic from '$lib/components/AvatarGraphic.svelte';
    import TextInput from '$lib/components/TextInput.svelte';
    import AvatarModal from '$lib/components/AvatarModal.svelte';
    import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
    import { superForm } from 'sveltekit-superforms';
    import FormTextInput from '$lib/components/FormTextInput.svelte';

    let { data = $bindable() } = $props();
    let showModal = $state(false);

    let server_errors = $state();
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

    const { enhance: email_enhance, errors: email_errors } = superForm(data.email_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_email = true;
        },
        onUpdate: async ({ form, result }) => {
            server_errors = result.data.errors;
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
        enhance: first_name_enhance
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

    const { errors: last_name_errors, enhance: last_name_enhance } = superForm(
        data.last_name_form,
        {
            invalidateAll: false,
            resetForm: false,
            onSubmit: async () => {
                creating_last_name = true;
            },
            onUpdate: async ({ form }) => {
                console.log(form.valid);
                if (form.valid) {
                    edit_last_name = false;
                } else {
                    edit_last_name = true;
                }
                creating_last_name = false;
            }
        }
    );
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

        <h1 class="text-4xl text-center font-bold">
            <span>Hi, </span>
            <span class="text-accent">{$first_name_form.first_name}</span>
            <span>!</span>
        </h1>
    </div>
    <p class="py-6">This is your profile page. Here you can see your details.</p>

    <div class="flex flex-col flex-1 gap-2 p-3 card bg-base-200">
        {#if server_errors}
            <h1 class="mt-2 step-subtitle warning">
                {server_errors}
            </h1>
        {/if}
        <form action="?/update_email" method="POST" use:email_enhance>
            <FormTextInput
                superform={data.email_form}
                field="email"
                label="Email"
                disabled={true}
                bind:edit_value={edit_email}
                bind:creating_value={creating_email}
            />
            {#if $email_errors.email}<span class="invalid text-error">{$email_errors.email}</span
                >{/if}
        </form>
        <form action="?/update_first_name" method="POST" use:first_name_enhance>
            <FormTextInput
                superform={data.first_name_form}
                field="first_name"
                label="First Name"
                bind:edit_value={edit_first_name}
                bind:creating_value={creating_first_name}
            />
            {#if $first_name_errors.first_name}<span class="invalid text-error"
                    >{$first_name_errors.first_name}</span
                >{/if}
        </form>
        <form action="?/update_last_name" method="POST" use:last_name_enhance>
            <FormTextInput
                superform={data.last_name_form}
                field="last_name"
                label="Last Name"
                bind:edit_value={edit_last_name}
                bind:creating_value={creating_last_name}
            />
            {#if $last_name_errors.last_name}<span class="invalid text-error"
                    >{$last_name_errors.last_name}</span
                >{/if}
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
                        disabled={!!data.user.thumbnail}>Upload image</button
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
