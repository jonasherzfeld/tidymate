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
  class="[[data-theme=light]_&]:hidden"
  src={LogoDark}
  {width}
  height={width} />
<img
  alt="Logo"
  class="[[data-theme=dark]_&]:hidden [[data-theme=default]_&]:hidden"
  src={LogoLight}
  {width}
  height={width} />
