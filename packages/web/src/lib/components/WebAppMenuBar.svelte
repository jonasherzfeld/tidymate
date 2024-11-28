<script lang="ts">
    import MenuBlock from './MenuBlock.svelte';
    import { page } from '$app/stores';
    import { getRestrictionType } from '$lib/utils/helpers';
    import type { RestrictionType } from '$lib/utils/constants';

    let isLoggedIn: boolean = $derived($page.data.user ? true : false);
    let isInHouse: boolean = $derived($page.data.house ? true : false);
    let restrictionType: RestrictionType[] = $derived(getRestrictionType(isLoggedIn, isInHouse));
</script>

<ul
    class="menu menu-horizontal justify-between h-20 sticky border-t-[1px] bottom-0 pl-10 pr-10 shadow-md gap-3 bg-base-300"
>
    <MenuBlock restricted={restrictionType} position={'menu'} buttonView={true} />
</ul>
