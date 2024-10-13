<script>
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import ImageInput from '$lib/components/ImageInput.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SmallLoader from '$lib/components/SmallLoader.svelte';
	import Avatar from '$lib/img/teamavatar.png';
	import { receive, send } from '$lib/utils/helpers';
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Hi, {$page.data.first_name}!</h1>
			<p class="py-6">
				Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
			<button class="btn btn-primary">Get Started</button>
		</div>
	</div>
</div>

