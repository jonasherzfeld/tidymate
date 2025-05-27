<script lang="ts">
  import LogoDark from "$lib/img/tidymate_logo_white.png";
  import LogoLight from "$lib/img/tidymate_logo.png";

  let {
    width = "30px"
  }: {
    width: string;
  } = $props();
</script>

<img
  alt="Logo"
  class="hidden dark:block"
  src={LogoDark}
  {width}
  height={width} />
<img alt="Logo" class="dark:hidden" src={LogoLight} {width} height={width} />
