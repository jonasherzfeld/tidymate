<script lang="ts">
    import HtmlIcon from 'virtual:icons/skill-icons/html';
    import CssIcon from 'virtual:icons/skill-icons/css';
    import JSIcon from 'virtual:icons/skill-icons/javascript';
    import TSIcon from 'virtual:icons/skill-icons/typescript';
    import SvelteIcon from 'virtual:icons/skill-icons/svelte';
    import GithubIcon from 'virtual:icons/skill-icons/github-dark';
    import LinkedInIcon from 'virtual:icons/skill-icons/linkedin';
</script>

<div class="flex bg-base-100 min-h-full items-start w-full justify-center">
    <div class="flex grow justify-center text-center max-w-screen-sm p-4 min-h-full">
        <div class="flex flex-col card h-fit gap-4 p-5 justify-center bg-base-300">
            <div class="text-2xl font-bold text-primary">What is this?</div>
            <div class="text-md text-justify">
                This web app is a <b class="text-secondary">hobby project</b> that I started to learn
                more about Full Stack development and dive into some technologies that I had not used
                before like
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
            <div class="text-md text-justify">
                While the intention is that this project is a fully functional web app, I have
                <b class="text-warning"
                    >currently restricted features like the registration of new users</b
                > to run this as a purely personal website for me and my family and by that avoid any
                potential legal issues.
            </div>
            <div class="text-md text-justify">
                That said I am always open to feedback and suggestions so if you have any ideas or
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
