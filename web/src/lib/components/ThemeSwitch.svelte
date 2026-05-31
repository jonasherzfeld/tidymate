<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { THEME_MAPPING } from "$lib/utils/constants";
  import SunIcon from "virtual:icons/mdi/weather-sunny";
  import MoonIcon from "virtual:icons/mdi/weather-night";

  let isDark: boolean = $state(
    browser ? document.documentElement.getAttribute("data-theme") === THEME_MAPPING.dark : false
  );

  const submitSetTheme: SubmitFunction = ({ action }) => {
    const theme = action.searchParams.get("theme");
    if (theme) {
      document.documentElement.setAttribute(
        "data-theme",
        theme === "dark" ? THEME_MAPPING.dark : THEME_MAPPING.light
      );
      isDark = theme === "dark";
    }
  };
</script>

<form method="POST" use:enhance={submitSetTheme} class="contents">
  <li>
    <button
      type="submit"
      formaction="/?/set_theme&theme={isDark ? 'light' : 'dark'}&redirectTo={$page.url.pathname}"
      class="text-base-content hover:bg-base-200 rounded-field flex items-center gap-3 px-3 py-2 text-sm transition-colors">
      {#if isDark}
        <SunIcon class="h-4 w-4" />
        Light mode
      {:else}
        <MoonIcon class="h-4 w-4" />
        Dark mode
      {/if}
    </button>
  </li>
</form>
