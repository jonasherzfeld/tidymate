<script lang="ts">
  import LogoDark from "$lib/img/tidymate_logo_white.png";
  import LogoLight from "$lib/img/tidymate_logo.png";

  let {
    width = "30px"
  }: {
    width: string;
  } = $props();

  const widthNum = parseInt(width);
</script>

<img
  alt="Logo"
  class="hidden dark:block"
  src={LogoDark}
  width={widthNum}
  height={widthNum}
  loading="lazy"
  style="max-width: {width}; height: auto;"
  decoding="async" />

<!-- Light theme logo with optimized sizing -->
<img
  alt="Logo"
  class="dark:hidden"
  src={LogoLight}
  width={widthNum}
  height={widthNum}
  loading="lazy"
  style="max-width: {width}; height: auto;"
  decoding="async" />
