<script>
    import { enhance } from '$app/forms';
    import Unknown_Avatar from '$lib/img/Unknown_person.jpg';
    import TextInput from '$lib/components/TextInput.svelte';
    import AvatarModal from '$lib/components/AvatarModal.svelte';
    import EditIcon from '$lib/icons/EditIcon.svelte';
    import SubmitIcon from '$lib/icons/SubmitIcon.svelte';

    let { data = $bindable() } = $props();
    let showModal = $state(false);
    let edit_first_name = $state(false);
    let edit_last_name = $state(false);
    let is_img_hover = $state(false);
    let handleImgHover = (value) => {
        is_img_hover = value;
    };
    let handleFirstName = async () => {
        return async ({ update }) => {
            await update();
            edit_first_name = false;
        };
    };
    let handleLastName = async () => {
        return async ({ update }) => {
            await update();
            edit_last_name = false;
        };
    };
</script>

<div class="grid bg-base-200 min-h-screen w-full items-start justify-center">
    <div class="grid justify-center text-center max-w-xl mt-10">
        <div class="flex justify-center items-center gap-2">
            <div class="relative text-center">
                <div class="avatar m-5">
                    <div
                        class="mask mask-squircle h-24 w-24"
                        role="img"
                        onmouseenter={() => {
                            handleImgHover(true);
                        }}
                        onmouseleave={() => {
                            handleImgHover(false);
                        }}
                    >
                        <button onclick={() => (showModal = true)}>
                            <img
                                src={data.user.thumbnail ? data.user.thumbnail : Unknown_Avatar}
                                alt="User"
                            />
                            <div
                                class="w-full absolute bottom-0 left-0 text-center h-6 bg-white bg-opacity-60"
                                aria-label="Change Avatar"
                                style="display: {is_img_hover ? 'block' : 'none'}"
                            >
                                <h2 class="text-sm text-base-300">Change</h2>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <h1 class="text-5xl text-center font-bold">Hi, {data.user.first_name}!</h1>
        </div>
        <p class="py-6">This is your profile page. Here you can see your details.</p>

        <div class="grid gap-2">
            <TextInput name="email" value={data.user.email} disabled={true}><b>Email</b></TextInput>
            <form action="?/update_first_name" method="POST" use:enhance={handleFirstName}>
                <div class="flex gap-2">
                    <TextInput
                        name="first_name"
                        class_in="input input-bordered flex w-full items-center gap-2 border-solid"
                        value={data.user.first_name}
                        disabled={!edit_first_name}
                        ><b>First name</b>
                    </TextInput>
                    {#if edit_first_name}
                        <button type="submit" class="btn btn-primary">
                            <SubmitIcon />
                        </button>
                    {:else}
                        <button
                            type="button"
                            class="btn btn-primary"
                            onclick={() => {
                                edit_first_name = true;
                            }}
                        >
                            <EditIcon />
                        </button>
                    {/if}
                </div>
            </form>
            <form action="?/update_last_name" method="POST" use:enhance={handleLastName}>
                <div class="flex">
                    <TextInput
                        name="last_name"
                        class_in="input input-bordered flex w-full items-center gap-2 border-solid"
                        value={data.user.last_name}
                        disabled={!edit_last_name}
                        ><b>First name</b>
                    </TextInput>
                    {#if edit_last_name}
                        <button type="submit" class="btn btn-primary">
                            <SubmitIcon />
                        </button>
                    {:else}
                        <button
                            type="button"
                            class="btn btn-primary"
                            onclick={() => {
                                edit_last_name = true;
                            }}
                        >
                            <EditIcon />
                        </button>
                    {/if}
                </div>
            </form>
            <TextInput name="joined_on" value={data.user.joined_on} disabled={true}
                ><b>Joined On</b>
            </TextInput>
        </div>
        <AvatarModal bind:showModal>
            <div class="flex items-center gap-3 mb-5">
                <div class="avatar m-5">
                    <div class="mask mask-squircle h-24 w-24">
                        <img
                            src={data.user.thumbnail ? data.user.thumbnail : Unknown_Avatar}
                            alt="User"
                        />
                    </div>
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
                        <div class="grid grid-cols-2 gap-3">
                            <button
                                class="btn"
                                type="submit"
                                formaction="user?/upload_image"
                                disabled={data.user.thumbnail}>Upload image</button
                            >
                            <button
                                class="btn btn-error"
                                formaction="user?/delete_image"
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
