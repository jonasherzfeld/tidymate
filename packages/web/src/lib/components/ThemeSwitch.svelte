<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import type { SubmitFunction } from '@sveltejs/kit';

    const submitSetTheme: SubmitFunction = ({ action }) => {
        const theme = action.searchParams.get('theme');
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    };

    function getCapitalized(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
</script>

<form method="POST" use:enhance={submitSetTheme}>
    <div class="dropdown">
        <div tabindex="0" role="button" class="btn m-1 btn-primary">Theme</div>
        <ul
            tabindex="-1"
            class="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl"
        >
            {#each ['dark', 'light'] as theme}
                <li>
                    <button
                        type="submit"
                        formaction="/?/set_theme&theme={theme}&redirectTo={$page.url.pathname}"
                        name="theme-dropdown"
                        class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                        aria-label={getCapitalized(theme)}
                        value={theme}>{getCapitalized(theme)}</button
                    >
                </li>
            {/each}
        </ul>
    </div>
</form>
