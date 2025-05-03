<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { ThemeIcon } from "$lib/utils/icons";

  const submitSetTheme: SubmitFunction = ({ action }) => {
    const theme = action.searchParams.get("theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  };

  function getCapitalized(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
</script>

<form method="POST" use:enhance={submitSetTheme}>
  <div class="dropdown dropdown-top w-full">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost h-6 w-full justify-start text-base font-normal">
      <ThemeIcon />Theme
    </div>
    <ul
      tabindex="-1"
      class="dropdown-content z-[1] w-72 rounded-box bg-base-100 p-2 shadow-2xl">
      {#each ["dark", "light"] as theme}
        <li>
          <button
            type="submit"
            formaction="/?/set_theme&theme={theme}&redirectTo={$page.url
              .pathname}"
            name="theme-dropdown"
            class="theme-controller btn btn-ghost btn-sm btn-block justify-start"
            aria-label={getCapitalized(theme)}
            value={theme}>{getCapitalized(theme)}</button>
        </li>
      {/each}
    </ul>
  </div>
</form>
