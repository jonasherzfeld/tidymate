<script lang="ts">
    import Logo_Dark from '$lib/img/tidymate_logo_white.png';
    import Logo_Light from '$lib/img/tidymate_logo.png';

    type Props = {
        width: string;
    };
    let { width = '30px' }: Props = $props();
</script>

<img alt="User" class="[[data-theme=light]_&]:hidden" src={Logo_Dark} {width} />
<img
    alt="User"
    class="[[data-theme=dark]_&]:hidden [[data-theme=default]_&]:hidden"
    src={Logo_Light}
    {width}
/>
