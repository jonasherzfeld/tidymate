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
    priority = false, // Set to true for LCP images (first visible avatar)
    children
  }: {
    thumbnail: string;
    height: string;
    width: string;
    textSize?: string;
    firstName?: string;
    lastName?: string;
    priority?: boolean;
    children?: Snippet;
  } = $props();

  let isLoggedIn = $derived(page.data.user ? true : false);

  let inputNameInitials = $state("");
  if (firstName && lastName) {
    inputNameInitials = firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase();
  }
  let derivedNameInitials = $derived(
    page.data.user?.first_name?.charAt(0).toUpperCase() +
      page.data.user?.last_name?.charAt(0).toUpperCase()
  );
  let noInitials = $derived(!inputNameInitials && !derivedNameInitials);

  const variants = {
    tiny: { size: "thumbnail", width: 12, height: 12 },
    small: { size: "thumbnail", width: 32, height: 32 },
    medium: { size: "medium", width: 64, height: 64 },
    large: { size: "original", width: 96, height: 96 },
    xl: { size: "original", width: 128, height: 128 }
  };

  const variant = $derived.by(() => {
    // Extract numeric value from Tailwind class (e.g., "w-8" -> 8)
    const widthMatch = width.match(/w-(\d+)/);
    const heightMatch = height.match(/h-(\d+)/);
    const w = widthMatch ? parseInt(widthMatch[1]) * 4 : 32; // Tailwind uses 4px per unit
    const h = heightMatch ? parseInt(heightMatch[1]) * 4 : 32;
    const maxDim = Math.max(w, h);

    if (maxDim <= 40) return variants.tiny; // <= 40px -> thumbnail (12px actual)
    if (maxDim <= 64) return variants.small; // <= 64px -> thumbnail (32px actual)
    if (maxDim <= 192) return variants.medium; // <= 192px -> medium (64px actual)
    if (maxDim <= 384) return variants.large; // <= 384px -> original (96px actual)
    return variants.xl; // > 384px -> original (128px actual)
  });
</script>

<div class={`mask mask-circle ${height} ${width}`}>
  {#if !isLoggedIn || (isLoggedIn && noInitials)}
    <img
      alt="User"
      src={UnknownAvatar}
      class="h-full w-full object-cover"
      width={variant.width}
      height={variant.height}
      loading={priority ? "eager" : "lazy"}
      fetchpriority={priority ? "high" : "auto"} />
  {:else if thumbnail}
    <UserImage
      filename={thumbnail}
      size={variant.size}
      width={variant.width}
      height={variant.height}
      {priority}
      lazy={!priority}
      alt={firstName ? `${firstName}'s avatar` : "User avatar"}
      class="h-full w-full object-cover" />
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
