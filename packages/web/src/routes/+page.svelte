<script lang="ts">
  import {
    HtmlIcon,
    CssIcon,
    JSIcon,
    TSIcon,
    SvelteIcon,
    LinkedInIcon,
    GithubIcon
  } from "$lib/utils/icons";
  import RainbowText from "$lib/components/RainbowText.svelte";
  import { ROUTE_MAPPING } from "$lib/utils/constants";
  import { page } from "$app/state";
  import { onMount } from "svelte";
    import { redirect } from "@sveltejs/kit";

  let showModal = $state(false);

  onMount(() => {
    console.log( page.data.from);
    if (page.data.from === "register") {
      showModal = true;
    }
  });
  $effect(() => {
    console.log( page.data.from);
    if (page.data.from === "register") {
      showModal = true;
    }
  });

  const aboutRoute = ROUTE_MAPPING.find((route) => route.title === "About");
  const docRoute = ROUTE_MAPPING.find(
    (route) => route.title === "Documentation"
  );
</script>

<div class="bg-base-100 flex min-h-full w-full justify-center">
  <!-- Modal -->
  {#if showModal}
    <div class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Registration Information</h3>
      <div class="text-md text-justify">
        This web app is a hobby project that I started to learn more about Full
        Stack development and dive into some technologies that I had not used
        before like
      </div>
      <div class="flex w-full justify-center gap-2">
        <div class="tooltip" data-tip="HTML">
          <HtmlIcon class="h-6 w-6" />
        </div>
        <div class="tooltip" data-tip="CSS">
          <CssIcon class="h-6 w-6" />
        </div>
        <div class="tooltip" data-tip="Javascript">
          <JSIcon class="h-6 w-6" />
        </div>
        <div class="tooltip" data-tip="Typescript">
          <TSIcon class="h-6 w-6" />
        </div>
        and
        <div class="tooltip" data-tip="Svelte">
          <SvelteIcon class="tooltip h-6 w-6" data-tip="Svelte" />
        </div>
      </div>
      <div class="text-md text-center">
        Find out more about the app <a
          href={aboutRoute?.url}
          class="btn-link text-accent">here</a>
        or on the
        <a
          href={docRoute?.url}
          target={docRoute?.target}
          class="btn-link text-info">documentation</a> page.
      </div>
      <div class="text-md text-justify">
        While the intention is that this project is a fully functional web app,
        I have currently
        <b class="font-semibold">restricted the registration of new users</b> to
        run this as a purely personal website for me and my family and by that avoid
        any potential legal issues.
      </div>
      <div class="text-md text-justify">
        That said I am always open to feedback and suggestions, so if you have
        any ideas or thoughts on how I can improve this project, please let me
        know!
      </div>
      <div class="flex w-full justify-center gap-2">
        <a
          href="https://www.linkedin.com/in/jonas-herzfeld/"
          target="_blank"
          rel="noopener noreferrer">
          <LinkedInIcon class="h-6 w-6" />
        </a>
        <a
          href="https://github.com/jonasherzfeld"
          target="_blank"
          rel="noopener noreferrer">
          <GithubIcon class="h-6 w-6 " /></a>
    </div>
        <div class="modal-action">
          <a href="/"><button class="btn" on:click={() => (showModal = false)}>Close</button></a>
        </div>
      </div>
    </div>
  {/if}

  <div
    class="flex min-h-full max-w-screen-sm flex-col items-center justify-center p-4 text-center">
    <h3 class="text-4xl">Welcome to</h3>
    <RainbowText classIn="text-5xl font-bold pb-10">Tidymate</RainbowText>
    <div
      class="flex h-fit max-w-screen-sm flex-col justify-center gap-4 rounded-lg p-6">
      Lorep Ipsum
    </div>
  </div>
</div>
