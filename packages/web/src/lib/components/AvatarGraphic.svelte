<script lang="ts">
    import { page } from '$app/stores';
    import Unknown_Avatar from '$lib/img/Unknown_person.jpg';
    import type { Snippet } from 'svelte';

    let {
        thumbnail,
        height,
        width,
        text_size = 'text-xl',
        first_name,
        last_name,
        children
    }: {
        thumbnail: string;
        height: string;
        width: string;
        text_size?: string;
        first_name?: string;
        last_name?: string;
        children?: Snippet;
    } = $props();

    let is_logged_in = $derived($page.data.user ? true : false);

    let input_name_initials = $state('');
    if (first_name && last_name) {
        input_name_initials =
            first_name?.charAt(0).toUpperCase() + last_name?.charAt(0).toUpperCase();
    }
    let derived_name_initials = $derived(
        $page.data.user?.first_name?.charAt(0).toUpperCase() +
            $page.data.user?.last_name?.charAt(0).toUpperCase()
    );
    let no_initials = $derived(!input_name_initials && !derived_name_initials);
</script>

<div class={`mask mask-squircle ${height} ${width}`}>
    {#if !is_logged_in || (is_logged_in && no_initials)}
        <img alt="User" src={Unknown_Avatar} />
    {:else if thumbnail}
        <img alt="User" src={thumbnail} />
    {:else}
        <div
            class={`flex items-center justify-center bg-primary text-white ${height} ${width} ${text_size}`}
        >
            {input_name_initials ? input_name_initials : derived_name_initials}
        </div>
    {/if}
    <div>
        {@render children?.()}
    </div>
</div>
