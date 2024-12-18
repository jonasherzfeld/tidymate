<script lang="ts">
  import TextInput from "$lib/components/TextInput.svelte";
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import AvatarModal from "$lib/components/AvatarModal.svelte";
  import ThemeSwitch from "$lib/components/ThemeSwitch.svelte";
  import { superForm } from "sveltekit-superforms";
  import FormTextInput from "$lib/components/FormTextInput.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let showModal: boolean = $state(false);

  let serverErrors: string = $state("");
  let creatingEmail: boolean = $state(false);
  let creatingFirstName: boolean = $state(false);
  let creatingLastName: boolean = $state(false);
  let editEmail: boolean = $state(false);
  let editFirstName: boolean = $state(false);
  let editLastName: boolean = $state(false);
  let isImgHover: boolean = $state(false);
  let handleImgHover = (value: boolean) => {
    isImgHover = value;
  };

  const { enhance: emailEnhance, errors: emailErrors } = superForm(
    data.emailForm,
    {
      invalidateAll: false,
      resetForm: false,
      onSubmit: async () => {
        creatingEmail = true;
      },
      onUpdate: async ({ form, result }) => {
        serverErrors = result.data.errors;
        if (form.valid) {
          editEmail = false;
        } else {
          editEmail = true;
        }
        creatingEmail = false;
      }
    }
  );

  const {
    form: firstNameForm,
    errors: firstNameErrors,
    enhance: firstNameEnhance
  } = superForm(data.firstNameForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => {
      creatingFirstName = true;
    },
    onUpdate: async ({ form }) => {
      if (form.valid) {
        editFirstName = false;
      } else {
        editFirstName = true;
      }
      creatingFirstName = false;
    }
  });

  const { errors: lastNameErrors, enhance: lastNameEnhance } = superForm(
    data.lastNameForm,
    {
      invalidateAll: false,
      resetForm: false,
      onSubmit: async () => {
        creatingLastName = true;
      },
      onUpdate: async ({ form }) => {
        if (form.valid) {
          editLastName = false;
        } else {
          editLastName = true;
        }
        creatingLastName = false;
      }
    }
  );
</script>

<div class="flex min-w-full flex-1 flex-col">
  <div class="justify-left ml-5 mr-2 flex items-center gap-5 sm:justify-center">
    <div class="relative text-center">
      <div
        class="avatar"
        role="img"
        onmouseenter={() => {
          handleImgHover(true);
        }}
        onmouseleave={() => {
          handleImgHover(false);
        }}>
        <button onclick={() => (showModal = true)}>
          <AvatarGraphic
            thumbnail={data.user.thumbnail}
            height="h-24"
            width="w-24"
            textSize="text-5xl font-bold">
            <div
              class="bg-base-300 absolute bottom-0 left-0 h-7 w-full bg-opacity-60 text-center"
              aria-label="Change Avatar"
              style="display: {isImgHover ? 'block' : 'none'}">
              <h2 class="text-sm">Change</h2>
            </div>
          </AvatarGraphic>
        </button>
      </div>
    </div>

    <h1 class="text-center text-4xl font-bold">
      <span>Hi, </span>
      <span class="text-accent">{$firstNameForm.first_name}</span>
      <span>!</span>
    </h1>
  </div>
  <p class="py-6">This is your profile page. Here you can see your details.</p>

  <div class="card bg-base-200 flex flex-1 flex-col gap-2 p-3">
    {#if serverErrors}
      <h1 class="step-subtitle warning mt-2">
        {serverErrors}
      </h1>
    {/if}
    <form action="?/update_email" method="POST" use:emailEnhance>
      <FormTextInput
        superform={data.emailForm}
        field="email"
        label="Email"
        disabled={true}
        bind:editValue={editEmail}
        bind:creatingValue={creatingEmail} />
      {#if $emailErrors.email}<span class="invalid text-error"
          >{$emailErrors.email}</span
        >{/if}
    </form>
    <form action="?/update_first_name" method="POST" use:firstNameEnhance>
      <FormTextInput
        superform={data.firstNameForm}
        field="first_name"
        label="First Name"
        bind:editValue={editFirstName}
        bind:creatingValue={creatingFirstName} />
      {#if $firstNameErrors.first_name}<span class="invalid text-error"
          >{$firstNameErrors.first_name}</span
        >{/if}
    </form>
    <form action="?/update_last_name" method="POST" use:lastNameEnhance>
      <FormTextInput
        superform={data.lastNameForm}
        field="last_name"
        label="Last Name"
        bind:editValue={editLastName}
        bind:creatingValue={creatingLastName} />
      {#if $lastNameErrors.last_name}<span class="invalid text-error"
          >{$lastNameErrors.last_name}</span
        >{/if}
    </form>
    <TextInput name="joined_on" value={data.user.joined_on} disabled={true}
      ><b>Joined On</b>
    </TextInput>
    <ThemeSwitch />
  </div>
</div>
<AvatarModal bind:showModal />
