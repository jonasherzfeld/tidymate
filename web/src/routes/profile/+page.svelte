<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { superForm } from "sveltekit-superforms";
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import AvatarModal from "$lib/components/AvatarModal.svelte";
  import FormTextInput from "$lib/components/FormTextInput.svelte";
  import HouseMemberTable from "$lib/components/HouseMemberTable.svelte";
  import JoinIdCreator from "$lib/components/JoinIdCreator.svelte";
  import ThemeSwitch from "$lib/components/ThemeSwitch.svelte";
  import { Button, Card, SectionHeader, Skeleton, toast } from "$lib/components/ui";
  import { browser } from "$app/environment";
  import {
    isPushSupported,
    getExistingSubscription,
    subscribeToPush,
    unsubscribeFromPush
  } from "$lib/utils/pushNotifications";
  import { BellIcon } from "$lib/utils/icons";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let showAvatarModal = $state(false);
  let serverErrors = $state("");

  let pushSupported = $state(false);
  let pushSubscribed = $state(false);
  let pushLoading = $state(false);

  onMount(() => {
    if (!browser) return;
    pushSupported = isPushSupported();
    if (!pushSupported) return;
    getExistingSubscription().then((sub) => {
      pushSubscribed = !!sub;
    });
  });

  async function togglePush() {
    pushLoading = true;
    try {
      if (pushSubscribed) {
        const success = await unsubscribeFromPush();
        if (success) {
          pushSubscribed = false;
          toast.success("Push notifications disabled");
        } else {
          toast.error("Couldn't disable push notifications");
        }
      } else {
        const success = await subscribeToPush();
        if (success) {
          pushSubscribed = true;
          toast.success("Push notifications enabled");
        } else {
          toast.error(
            "Couldn't enable push notifications",
            "The server may be missing VAPID keys, or you denied permission."
          );
        }
      }
    } finally {
      pushLoading = false;
    }
  }

  let creatingEmail = $state(false);
  let creatingFirstName = $state(false);
  let creatingLastName = $state(false);
  let editEmail = $state(false);
  let editFirstName = $state(false);
  let editLastName = $state(false);

  let creatingName = $state(false);
  let creatingCity = $state(false);
  let creatingCountry = $state(false);
  let editName = $state(false);
  let editCity = $state(false);
  let editCountry = $state(false);

  const isWebApp: boolean = getContext<() => boolean>("webapp")();

  const { enhance: emailEnhance, errors: emailErrors } = superForm(data.emailForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => (creatingEmail = true),
    onUpdate: async ({ form, result }) => {
      serverErrors = result.data?.errors ?? "";
      editEmail = !form.valid;
      creatingEmail = false;
    }
  });

  const {
    form: firstNameForm,
    errors: firstNameErrors,
    enhance: firstNameEnhance
  } = superForm(data.firstNameForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => (creatingFirstName = true),
    onUpdate: async ({ form }) => {
      editFirstName = !form.valid;
      creatingFirstName = false;
    }
  });

  const { errors: lastNameErrors, enhance: lastNameEnhance } = superForm(data.lastNameForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => (creatingLastName = true),
    onUpdate: async ({ form }) => {
      editLastName = !form.valid;
      creatingLastName = false;
    }
  });

  const {
    form: nameForm,
    errors: nameErrors,
    enhance: nameEnhance
  } = superForm(data.nameForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => (creatingName = true),
    onUpdate: async ({ form }) => {
      editName = !form.valid;
      creatingName = false;
    }
  });

  const { errors: cityErrors, enhance: cityEnhance } = superForm(data.cityForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => (creatingCity = true),
    onUpdate: async ({ form }) => {
      editCity = !form.valid;
      creatingCity = false;
    }
  });

  const { errors: countryErrors, enhance: countryEnhance } = superForm(data.countryForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => (creatingCountry = true),
    onUpdate: async ({ form }) => {
      editCountry = !form.valid;
      creatingCountry = false;
    }
  });
</script>

<div class="mx-auto flex w-full max-w-screen-md flex-1 flex-col gap-6 px-4 py-6">
  <!-- Identity -->
  <div class="flex items-center gap-4">
    <button
      class="bg-base-200 ring-base-100 hover:ring-primary/40 rounded-full ring-4 transition-shadow"
      aria-label="Change avatar"
      onclick={() => (showAvatarModal = true)}>
      <AvatarGraphic
        thumbnail={data.user.thumbnail}
        height="h-20"
        width="w-20"
        textSize="text-3xl font-semibold" />
    </button>
    <div class="min-w-0">
      <div class="text-muted text-xs tracking-wide uppercase">Signed in as</div>
      <h1 class="text-base-content truncate text-2xl font-semibold tracking-tight">
        {$firstNameForm.first_name}
      </h1>
      <div class="text-muted truncate text-sm">{data.house.name}</div>
    </div>
  </div>

  {#if serverErrors}
    <div class="bg-error/10 text-error border-error/20 rounded-field border px-3 py-2 text-sm">
      {serverErrors}
    </div>
  {/if}

  <!-- Account -->
  <section class="flex flex-col gap-3">
    <SectionHeader title="Account" subtitle="Your personal info." />
    <Card padding="md" class="flex flex-col gap-4">
      <form action="/profile/user?/update_email" method="POST" use:emailEnhance>
        <FormTextInput
          superform={data.emailForm}
          field="email"
          label="Email"
          disabled={true}
          bind:editValue={editEmail}
          bind:creatingValue={creatingEmail} />
        {#if $emailErrors.email}
          <span class="text-error mt-1 text-sm">{$emailErrors.email}</span>
        {/if}
      </form>
      <form action="/profile/user?/update_first_name" method="POST" use:firstNameEnhance>
        <FormTextInput
          superform={data.firstNameForm}
          field="first_name"
          label="First Name"
          bind:editValue={editFirstName}
          bind:creatingValue={creatingFirstName} />
        {#if $firstNameErrors.first_name}
          <span class="text-error mt-1 text-sm">{$firstNameErrors.first_name}</span>
        {/if}
      </form>
      <form action="/profile/user?/update_last_name" method="POST" use:lastNameEnhance>
        <FormTextInput
          superform={data.lastNameForm}
          field="last_name"
          label="Last Name"
          bind:editValue={editLastName}
          bind:creatingValue={creatingLastName} />
        {#if $lastNameErrors.last_name}
          <span class="text-error mt-1 text-sm">{$lastNameErrors.last_name}</span>
        {/if}
      </form>
      <div class="text-muted text-xs">
        Member since {new Date(data.user.joined_on).toLocaleDateString()}
      </div>
    </Card>
  </section>

  <!-- Household -->
  <section class="flex flex-col gap-3">
    <SectionHeader title="Household" subtitle="Shared with everyone in {$nameForm.name}." />
    <Card padding="md" class="flex flex-col gap-4">
      <form action="/profile/house?/update_name" method="POST" use:nameEnhance>
        <FormTextInput
          superform={data.nameForm}
          field="name"
          label="Name"
          bind:editValue={editName}
          bind:creatingValue={creatingName} />
        {#if $nameErrors.name}
          <span class="text-error mt-1 text-sm">{$nameErrors.name}</span>
        {/if}
      </form>
      <form action="/profile/house?/update_city" method="POST" use:cityEnhance>
        <FormTextInput
          superform={data.cityForm}
          field="city"
          label="City"
          bind:editValue={editCity}
          bind:creatingValue={creatingCity} />
        {#if $cityErrors.city}
          <span class="text-error mt-1 text-sm">{$cityErrors.city}</span>
        {/if}
      </form>
      <form action="/profile/house?/update_country" method="POST" use:countryEnhance>
        <FormTextInput
          superform={data.countryForm}
          field="country"
          label="Country"
          bind:editValue={editCountry}
          bind:creatingValue={creatingCountry} />
        {#if $countryErrors.country}
          <span class="text-error mt-1 text-sm">{$countryErrors.country}</span>
        {/if}
      </form>
      <div class="text-muted text-xs">
        Created {new Date(data.house.created_on).toLocaleDateString()}
      </div>
    </Card>
  </section>

  <!-- Members -->
  <section class="flex flex-col gap-3">
    <SectionHeader title="Members" subtitle="People with access to this household." />
    <Card padding="md">
      {#await data.streamed.user_list}
        <div class="flex flex-col gap-3">
          <Skeleton class="h-12 w-full" />
          <Skeleton class="h-12 w-full" />
          <Skeleton class="h-12 w-full" />
        </div>
      {:then user_list}
        <HouseMemberTable userList={user_list} changeEnabled={data.user.is_admin} />
      {/await}
    </Card>
    {#if data.user.is_admin}
      <Card padding="md">
        <JoinIdCreator bind:serverErrors />
      </Card>
    {/if}
  </section>

  <!-- Preferences -->
  <section class="flex flex-col gap-3">
    <SectionHeader title="Preferences" subtitle="App settings." />
    <Card padding="md" class="divide-neutral flex flex-col divide-y">
      {#if isWebApp}
        <div class="-mx-4 -mt-4 px-4 py-2">
          <ul class="menu w-full p-0">
            <ThemeSwitch />
          </ul>
        </div>
      {/if}
      {#if pushSupported}
        <div class="-mx-4 flex items-center justify-between gap-4 px-4 pt-4">
          <div class="flex items-start gap-3">
            <div
              class="bg-primary/10 text-primary mt-0.5 flex h-9 w-9 items-center justify-center rounded-full">
              <BellIcon class="h-4 w-4" />
            </div>
            <div>
              <div class="text-base-content text-sm font-medium">Push notifications</div>
              <div class="text-muted text-xs">Get notified about chores, todos and reminders.</div>
            </div>
          </div>
          <Button
            variant={pushSubscribed ? "outline" : "primary"}
            size="sm"
            loading={pushLoading}
            onclick={togglePush}>
            {pushSubscribed ? "Disable" : "Enable"}
          </Button>
        </div>
      {/if}
    </Card>
  </section>
</div>

<AvatarModal bind:showModal={showAvatarModal} actionBase="/profile/user" />
