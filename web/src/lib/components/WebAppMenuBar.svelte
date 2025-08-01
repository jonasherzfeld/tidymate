<script lang="ts">
  import MenuBlock from "./MenuBlock.svelte";
  import { page } from "$app/stores";
  import { getRestrictionType } from "$lib/utils/helpers";
  import type { RestrictionType } from "$lib/utils/constants";

  let isLoggedIn: boolean = $derived($page.data.user ? true : false);
  let isInHouse: boolean = $derived($page.data.house ? true : false);
  let restrictionType: RestrictionType[] = $derived(
    getRestrictionType(isLoggedIn, isInHouse)
  );
</script>

<ul
  class="menu menu-horizontal bg-base-300 h-webapp-menu fixed bottom-0 left-0 right-0 z-20 w-full justify-between gap-3 border-t-[1px] pl-10 pr-10 shadow-md">
  <MenuBlock restricted={restrictionType} position={"menu"} buttonView={true} />
</ul>
