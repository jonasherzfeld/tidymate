<script>
  import { page } from "$app/stores";
</script>

<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content text-center">
    <div class="max-w-5xl">
      <h1 class="text-5xl">{$page.status} {$page.error?.message}</h1>
      <span class="text-sm">
        {#if $page.status === 404}
          The page you requested could not be found!
        {:else}
          An error occured, please try again later!
        {/if}
      </span>
    </div>
  </div>
</div>
