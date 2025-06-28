<script lang="ts">
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import type { PageData } from "../$types";

  let { data }: { data: PageData } = $props();
</script>

<div
  class="bg-base-100 flex min-h-full w-full flex-1 items-start justify-center">
  <div
    class="mt-5 flex w-full max-w-screen-lg flex-1 flex-col justify-center gap-5 p-4 text-center">
    <h1 class="text-5xl font-bold">{data.house.name}</h1>
    <div class="stats stats-vertical bg-base-300 md:stats-horizontal shadow">
      <div class="stat">
        <div class="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-8 w-8 stroke-current">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </div>
        <div class="stat-title">Total Chores</div>
        <div class="stat-value text-primary">25.6K</div>
        <div class="stat-desc">21% more than last month</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-8 w-8 stroke-current">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div class="stat-title">Chores this year</div>
        <div class="stat-value text-secondary">2.6M</div>
        <div class="stat-desc">21% more than last month</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <div class="avatar online">
            <AvatarGraphic
              thumbnail={data.user?.thumbnail}
              height="h-24"
              width="w-24"
              textSize="text-xl" />
          </div>
        </div>
        <div class="stat-value">86%</div>
        <div class="stat-title">Tasks done</div>
        <div class="stat-desc text-secondary">31 tasks remaining</div>
      </div>
    </div>
  </div>
</div>
