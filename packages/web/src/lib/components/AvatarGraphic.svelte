<script lang="ts">
  import { page } from "$app/stores";
  import UnknownAvatar from "$lib/img/Unknown_person.jpg";
  import type { Snippet } from "svelte";

  let {
    thumbnail,
    height,
    width,
    textSize = "text-xl",
    firstName,
    lastName,
    children
  }: {
    thumbnail: string;
    height: string;
    width: string;
    textSize?: string;
    firstName?: string;
    lastName?: string;
    children?: Snippet;
  } = $props();

  let isLoggedIn = $derived($page.data.user ? true : false);

  let inputNameInitials = $state("");
  if (firstName && lastName) {
    inputNameInitials =
      firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase();
  }
  let derivedNameInitials = $derived(
    $page.data.user?.first_name?.charAt(0).toUpperCase() +
      $page.data.user?.last_name?.charAt(0).toUpperCase()
  );
  let noInitials = $derived(!inputNameInitials && !derivedNameInitials);
</script>

<div class={`mask mask-circle ${height} ${width}`}>
  {#if !isLoggedIn || (isLoggedIn && noInitials)}
    <img alt="User" src={UnknownAvatar} />
  {:else if thumbnail}
    <img alt="User" src={thumbnail} />
  {:else}
    <div
      class={`bg-primary flex items-center justify-center text-white ${height} ${width} ${textSize}`}>
      {inputNameInitials ? inputNameInitials : derivedNameInitials}
    </div>
  {/if}
  <div>
    {@render children?.()}
  </div>
</div>
