<script lang="ts">
  import { page } from "$app/state";
  import UnknownAvatar from "$lib/img/Unknown_person.jpg";
  import type { Snippet } from "svelte";
  import UserImage from "./UserImage.svelte";

  let {
    thumbnail,
    height,
    width,
    textSize = "text-lg",
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

  let isLoggedIn = $derived(page.data.user ? true : false);

  let inputNameInitials = $state("");
  if (firstName && lastName) {
    inputNameInitials =
      firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase();
  }
  let derivedNameInitials = $derived(
    page.data.user?.first_name?.charAt(0).toUpperCase() +
      page.data.user?.last_name?.charAt(0).toUpperCase()
  );
  let noInitials = $derived(!inputNameInitials && !derivedNameInitials);

  const variants = {
    tiny: { size: "thumbnail", width: 12, height: 12 },
    small: { size: "medium", width: 24, height: 24 },
    medium: { size: "medium", width: 48, height: 48 },
    large: { size: "large", width: 96, height: 96 },
    xl: { size: "large", width: 128, height: 128 }
  };

  const variant = $derived.by(() => {
    if (width <= "w-10" || height <= "h-10") return variants.tiny;
    if (width <= "w-24" || height <= "h-24") return variants.small;
    if (width <= "w-48" || height <= "h-48") return variants.medium;
    if (width <= "w-96" || height <= "h-96") return variants.large;
    if (width <= "w-128" || height <= "h-128") return variants.xl;
    return variants.small; // Default
  });
</script>

<div class={`mask mask-circle ${height} ${width}`}>
  {#if !isLoggedIn || (isLoggedIn && noInitials)}
    <img alt="User" src={UnknownAvatar} class="h-4 w-4" />
  {:else if thumbnail}
    <UserImage
      filename={thumbnail}
      size={variant.size}
      width={variant.width}
      height={variant.height}
      alt={firstName ? `${firstName}'s avatar` : "User avatar"}
      class="avatar-image" />
  {:else}
    <div
      class={`bg-primary flex items-center justify-center font-normal text-white ${height} ${width} ${textSize}`}>
      {inputNameInitials ? inputNameInitials : derivedNameInitials}
    </div>
  {/if}
  <div>
    {@render children?.()}
  </div>
</div>
