<script lang="ts">
    import {
        HtmlIcon,
        CssIcon,
        JSIcon,
        TSIcon,
        SvelteIcon,
        LinkedInIcon,
        GithubIcon
    } from '$lib/utils/icons';
    import RainbowText from '$lib/components/RainbowText.svelte';
    import { ROUTE_MAPPING } from '$lib/utils/constants';

    const aboutRoute = ROUTE_MAPPING.find((route) => route.title === 'About');
    const docRoute = ROUTE_MAPPING.find((route) => route.title === 'Documentation');
</script>

<div class="flex bg-base-100 min-h-full w-full justify-center">
    <div
        class="flex flex-col justify-center items-center text-center p-4 max-w-screen-sm min-h-full"
    >
        <h3 class="text-3xl">Welcome to</h3>
        <RainbowText classIn="text-5xl font-bold pb-10">Tidymate</RainbowText>
        <div
            class="flex flex-col card max-w-screen-sm rounded-lg h-fit gap-4 p-6 justify-center bg-base-300"
        >
            <div class="text-md text-justify">
                This web app is a hobby project that I started to learn more about Full Stack
                development and dive into some technologies that I had not used before like
            </div>
            <div class="flex w-full justify-center gap-2">
                <div class="tooltip" data-tip="HTML">
                    <HtmlIcon class="w-6 h-6" />
                </div>
                <div class="tooltip" data-tip="CSS">
                    <CssIcon class="w-6 h-6" />
                </div>
                <div class="tooltip" data-tip="Javascript">
                    <JSIcon class="w-6 h-6" />
                </div>
                <div class="tooltip" data-tip="Typescript">
                    <TSIcon class="w-6 h-6" />
                </div>
                and
                <div class="tooltip" data-tip="Svelte">
                    <SvelteIcon class="w-6 h-6 tooltip" data-tip="Svelte" />
                </div>
            </div>
            <div class="text-md text-center">
                Find out more about the app <a href={aboutRoute?.url} class="btn-link text-accent"
                    >here</a
                >
                or on the
                <a href={docRoute?.url} target={docRoute?.target} class="btn-link text-info"
                    >documentation</a
                > page.
            </div>
            <div class="text-md text-justify">
                While the intention is that this project is a fully functional web app, I have
                currently
                <b class="font-semibold">restricted the registration of new users</b> to run this as
                a purely personal website for me and my family and by that avoid any potential legal
                issues.
            </div>
            <div class="text-md text-justify">
                That said I am always open to feedback and suggestions, so if you have any ideas or
                thoughts on how I can improve this project, please let me know!
            </div>
            <div class="flex w-full justify-center gap-2">
                <a
                    href="https://www.linkedin.com/in/jonas-herzfeld/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <LinkedInIcon class="w-6 h-6" />
                </a>
                <a
                    href="https://github.com/jonasherzfeld"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <GithubIcon class="w-6 h-6 " /></a
                >
            </div>
        </div>
    </div>
</div>
