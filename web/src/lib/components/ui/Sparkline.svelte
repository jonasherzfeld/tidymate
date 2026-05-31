<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    data,
    width = 160,
    height = 48,
    strokeWidth = 1.75,
    showArea = true,
    showDots = false,
    class: className = ""
  }: {
    data: number[];
    width?: number;
    height?: number;
    strokeWidth?: number;
    showArea?: boolean;
    showDots?: boolean;
    class?: string;
  } = $props();

  const padX = 2;
  const padY = 4;

  let geometry = $derived.by(() => {
    if (!data.length) {
      return { points: "", area: "", lastPoint: null as { x: number; y: number } | null };
    }
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = Math.max(max - min, 1);
    const innerW = width - padX * 2;
    const innerH = height - padY * 2;
    const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

    const pts = data.map((v, i) => {
      const x = padX + i * stepX;
      const y = padY + innerH - ((v - min) / range) * innerH;
      return { x, y };
    });

    const points = pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
    const baseY = (height - padY).toFixed(2);
    const lineSegments = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");
    const area = `M ${pts[0].x.toFixed(2)} ${baseY} ${lineSegments.replace(/^M/, "L")} L ${pts[pts.length - 1].x.toFixed(2)} ${baseY} Z`;

    return { points, area, lastPoint: pts[pts.length - 1] };
  });
</script>

<svg
  {width}
  {height}
  viewBox="0 0 {width} {height}"
  preserveAspectRatio="none"
  role="img"
  aria-label="Trend over last {data.length} days"
  class={cn("overflow-visible", className)}>
  {#if data.length > 0}
    <defs>
      <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0.22"></stop>
        <stop offset="100%" stop-color="currentColor" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
    {#if showArea}
      <path d={geometry.area} fill="url(#sparkArea)" stroke="none"></path>
    {/if}
    <polyline
      points={geometry.points}
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"></polyline>
    {#if showDots && geometry.lastPoint}
      <circle
        cx={geometry.lastPoint.x}
        cy={geometry.lastPoint.y}
        r={strokeWidth * 1.4}
        fill="currentColor"></circle>
    {/if}
  {/if}
</svg>
