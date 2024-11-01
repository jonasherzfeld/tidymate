<script lang="ts">
	let { children } = $props();
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center ">
		<div class="max-w-5xl">
			{@render children?.()}
		</div>
	</div>
</div>
