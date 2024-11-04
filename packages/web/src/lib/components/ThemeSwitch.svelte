<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import type { SubmitFunction } from "@sveltejs/kit";

    const submitSetTheme: SubmitFunction = ({action}) => {
        const theme = action.searchParams.get('theme');
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    };

    let test = $state("synthwave");
</script>

<form method="POST" use:enhance={submitSetTheme}>
    <div class="dropdown">
        <div tabindex="0" role="button" class="btn m-1 btn-primary">
          Theme
        </div>
        <ul tabindex="-1" class="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl">
          <li>
            <button
              type="submit"
              formaction="/?/set_theme&theme=dark&redirectTo={$page.url.pathname}"
              name="theme-dropdown"
              class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label="Dark"
              value="dark">Dark</button>
          </li>
          <li>
            <button
              type="submit"
              formaction="/?/set_theme&theme=light&redirectTo={$page.url.pathname}"
              name="theme-dropdown"
              class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label="Light"
              value="light">Light</button>
          </li>

        </ul>
      </div>
</form>