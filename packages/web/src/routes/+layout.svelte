<script>
	import Drawer from '$lib/components/Drawer.svelte';
	import Footer from '$lib/components/Footer.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Drawer>
	<slot />

	<Footer />
</Drawer>
