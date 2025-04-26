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
  class="menu menu-horizontal sticky bottom-0 h-20 justify-between gap-3 border-t-[1px] bg-base-300 pl-10 pr-10 shadow-md">
  <MenuBlock restricted={restrictionType} position={"menu"} buttonView={true} />
</ul>
