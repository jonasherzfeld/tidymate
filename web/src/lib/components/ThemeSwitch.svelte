<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { ThemeIcon } from "$lib/utils/icons";
  import { THEME_MAPPING } from "$lib/utils/constants";

  export function getValueForTheme(str: string) {
    if (str === "dark") {
      return "dracula";
    } else if (str === "light") {
      return "cupcake";
    }
    return str;
  }

  const submitSetTheme: SubmitFunction = ({ action }) => {
    const theme = action.searchParams.get("theme");
    if (theme) {
      document.documentElement.setAttribute(
        "data-theme",
        theme === "dark" ? THEME_MAPPING.dark : THEME_MAPPING.light
      );
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
      class="btn btn-neutral h-10 w-full justify-start pl-3 text-base font-normal">
      <ThemeIcon />Theme
    </div>
    <ul
      tabindex="-1"
      class="dropdown-content rounded-box bg-base-100 z-[1] w-72 p-2 shadow-2xl">
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
