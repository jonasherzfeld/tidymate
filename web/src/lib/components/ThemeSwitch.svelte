<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import type { SubmitFunction } from "@sveltejs/kit";

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
  <div class="dropdown">
    <div tabindex="0" role="button" class="btn btn-primary m-1">Theme</div>
    <ul
      tabindex="-1"
      class="dropdown-content z-[1] w-52 rounded-box bg-base-300 p-2 shadow-2xl">
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
