<script>
  import Logo from "./Logo.svelte";
</script>

<footer class="footer bg-base-300 text-shade-500 items-center p-4">
  <aside class="grid-flow-col items-center">
    <Logo width="30px" />
    <p>Copyright © {new Date().getFullYear()} Jonas Herzfeld</p>
  </aside>
</footer>
