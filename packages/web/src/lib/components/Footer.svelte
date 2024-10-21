<script>
    import 'tailwindcss/tailwind.css';
    import Logo from '$lib/img/tidymate_logo_white.png';
</script>

<footer class="footer bg-base-100 text-shade-500 items-center p-4">
    <aside class="grid-flow-col items-center">
        <img alt="Tidymate" src={Logo} width="30px" />
        <p>Copyright © {new Date().getFullYear()} Jonas Herzfeld</p>
    </aside>
</footer>
