<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { THEME_MAPPING } from "$lib/utils/constants";
  import SunIcon from "virtual:icons/mdi/weather-sunny";
  import MoonIcon from "virtual:icons/mdi/weather-night";

  export function getValueForTheme(str: string) {
    if (str === "dark") {
      return "dracula";
    } else if (str === "light") {
      return "cupcake";
    }
    return str;
  }

  let isDark: boolean = $state(
    browser
      ? document.documentElement.getAttribute("data-theme") ===
          THEME_MAPPING.dark
      : false
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

<form method="POST" use:enhance={submitSetTheme}>
  <li class="gap-8 text-base">
    <button
      type="submit"
      formaction="/?/set_theme&theme={isDark
        ? 'light'
        : 'dark'}&redirectTo={$page.url.pathname}">
      {#if isDark}
        <MoonIcon />Dark Mode
      {:else}
        <SunIcon />Light Mode
      {/if}
    </button>
  </li>
</form>
