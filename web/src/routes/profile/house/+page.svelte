<script lang="ts">
  import TextInput from "$lib/components/TextInput.svelte";
  import FormTextInput from "$lib/components/FormTextInput.svelte";
  import JoinIdCreator from "$lib/components/JoinIdCreator.svelte";
  import { superForm } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import HouseMemberTable from "$lib/components/HouseMemberTable.svelte";

  let { data }: { data: PageData } = $props();
  const {
    form: nameForm,
    errors: nameErrors,
    enhance: nameEnhance
  } = superForm(data.nameForm, {
    invalidateAll: false,
    resetForm: false,
    onSubmit: async () => {
      creatingName = true;
    },
    onUpdate: async ({ form }) => {
      if (form.valid) {
        editName = false;
      } else {
        editName = true;
      }
      creatingName = false;
    }
  });

  const { errors: cityErrors, enhance: cityEnhance } = superForm(
    data.cityForm,
    {
      invalidateAll: false,
      resetForm: false,
      onSubmit: async () => {
        creatingCity = true;
      },
      onUpdate: async ({ form }) => {
        if (form.valid) {
          editCity = false;
        } else {
          editCity = true;
        }
        creatingCity = false;
      }
    }
  );

  const { errors: countryErrors, enhance: countryEnhance } = superForm(
    data.countryForm,
    {
      invalidateAll: false,
      resetForm: false,
      onSubmit: async () => {
        creatingCountry = true;
      },
      onUpdate: async ({ form }) => {
        if (form.valid) {
          editCountry = false;
        } else {
          editCountry = true;
        }
        creatingCountry = false;
      }
    }
  );

  let serverErrors: string = $state("");
  let editName: boolean = $state(false);
  let editCountry: boolean = $state(false);
  let editCity: boolean = $state(false);
  let creatingName: boolean = $state(false);
  let creatingCountry: boolean = $state(false);
  let creatingCity: boolean = $state(false);
</script>

<div class="flex min-w-full flex-1 flex-col">
  <h1 class="text-accent text-5xl font-bold">{$nameForm.name}</h1>
  <p class="py-4">This is the settings page for your house!</p>
  <div class="flex min-w-full flex-1 flex-col gap-3 mb-5">
    <div class="card bg-base-200 flex flex-1 flex-col gap-4 p-3">
      <form action="?/update_name" method="POST" use:nameEnhance>
        <FormTextInput
          superform={data.nameForm}
          field="name"
          label="Name"
          bind:editValue={editName}
          bind:creatingValue={creatingName} />
        {#if $nameErrors.name}<span class="invalid text-error"
            >{$nameErrors.name}</span
          >{/if}
      </form>
      <form action="?/update_city" method="POST" use:cityEnhance>
        <FormTextInput
          superform={data.cityForm}
          field="city"
          label="City"
          bind:editValue={editCity}
          bind:creatingValue={creatingCity} />
        {#if $cityErrors.city}<span class="invalid text-error"
            >{$cityErrors.city}</span
          >{/if}
      </form>
      <form action="?/update_country" method="POST" use:countryEnhance>
        <FormTextInput
          superform={data.countryForm}
          field="country"
          label="Country"
          bind:editValue={editCountry}
          bind:creatingValue={creatingCountry} />
        {#if $countryErrors.country}<span class="invalid text-error"
            >{$countryErrors.country}</span
          >{/if}
      </form>
      <TextInput name="joined_on" value={data.house.created_on} disabled={true}
        ><b>Created On</b>
      </TextInput>
    </div>

    <div class="card bg-base-200 flex flex-1 flex-col gap-2 p-3">
      <h2 class="m-4 text-xl font-bold">House Members</h2>
      {#await data.streamed.user_list}
        <div class="flex w-full flex-col gap-4">
          <div class="skeleton h-32 w-full"></div>
          <div class="skeleton h-4 w-28"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-full"></div>
        </div>
      {:then user_list}
        <HouseMemberTable
          userList={user_list}
          changeEnabled={data.user.is_admin} />
      {/await}
    </div>

    {#if data.user.is_admin}
      <JoinIdCreator bind:serverErrors />
      {#if serverErrors}
        <span class="invalid text-error">{serverErrors}</span>
      {/if}
    {/if}
  </div>
</div>
