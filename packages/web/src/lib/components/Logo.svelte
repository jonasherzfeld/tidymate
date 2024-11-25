<script lang="ts">
    import Logo_Dark from '$lib/img/tidymate_logo_white.png';
    import Logo_Light from '$lib/img/tidymate_logo.png';

    let {
        width = '30px'
    }: {
        width: string;
    } = $props();
</script>

<img alt="Logo" class="[[data-theme=light]_&]:hidden" src={Logo_Dark} {width} height={width} />
<img
    alt="Logo"
    class="[[data-theme=dark]_&]:hidden [[data-theme=default]_&]:hidden"
    src={Logo_Light}
    {width}
    height={width}
/>
