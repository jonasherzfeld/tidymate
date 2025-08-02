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
  class="menu menu-horizontal h-webapp-menu bg-base-300 fixed right-0 bottom-0 left-0 z-20 w-full justify-between gap-5 border-t-[1px] pr-5 pl-5 shadow-md">
  <MenuBlock
    restricted={restrictionType}
    position={"menu_left"}
    buttonView={true} />
  <MenuBlock
    restricted={restrictionType}
    position={"menu_mid"}
    buttonView={true} />
  <MenuBlock
    restricted={restrictionType}
    position={"menu_right"}
    buttonView={true} />
</ul>
