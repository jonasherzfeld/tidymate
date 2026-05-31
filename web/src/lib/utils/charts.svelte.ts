import type { ChartConfiguration, Chart as ChartType } from "chart.js";

type ChartCtor = typeof import("chart.js").Chart;

/**
 * Scriptable borderRadius for stacked bars: rounds only the outer corners of
 * the whole stack (top of topmost non-zero segment, bottom of bottommost),
 * leaving inner joins flat so the stack reads as a single rounded shape.
 */
export function stackedBarRadius(radius: number) {
  return (ctx: any) => {
    const { datasetIndex, dataIndex, chart } = ctx;
    const datasets = chart.data.datasets;
    let top = -1;
    let bottom = -1;
    for (let i = datasets.length - 1; i >= 0; i--) {
      if ((datasets[i].data[dataIndex] as number) > 0) {
        top = i;
        break;
      }
    }
    for (let i = 0; i < datasets.length; i++) {
      if ((datasets[i].data[dataIndex] as number) > 0) {
        bottom = i;
        break;
      }
    }
    if (datasetIndex === top && datasetIndex === bottom) return radius;
    if (datasetIndex === top)
      return { topLeft: radius, topRight: radius, bottomLeft: 0, bottomRight: 0 };
    if (datasetIndex === bottom)
      return { topLeft: 0, topRight: 0, bottomLeft: radius, bottomRight: radius };
    return 0;
  };
}

let chartPromise: Promise<ChartCtor> | null = null;

function loadChart(): Promise<ChartCtor> {
  if (!chartPromise) {
    chartPromise = import("chart.js").then(
      ({ Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend }) => {
        Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
        return Chart;
      }
    );
  }
  return chartPromise;
}

export function BarChart(node: HTMLElement, config: any) {
  let chart: ChartType | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let destroyed = false;
  let currentConfig = config;

  async function createChart() {
    if (destroyed) return;
    const Chart = await loadChart();
    if (destroyed) return;

    if (chart) {
      chart.destroy();
      chart = null;
    }

    node.innerHTML = "";
    canvas = document.createElement("canvas");
    node.appendChild(canvas);

    if (!currentConfig.datasets?.length) return;

    const chartConfig: ChartConfiguration<"bar"> = {
      type: "bar",
      data: {
        labels: currentConfig.labels,
        datasets: currentConfig.datasets
      },
      options: currentConfig.options || {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    };

    chart = new Chart(canvas, chartConfig);
  }

  createChart();

  return {
    update(newConfig: any) {
      currentConfig = newConfig;
      if (chart) {
        chart.data.labels = newConfig.labels;
        chart.data.datasets = newConfig.datasets;
        chart.update("none");
      } else {
        createChart();
      }
    },
    destroy() {
      destroyed = true;
      if (chart) {
        chart.destroy();
        chart = null;
      }
    }
  };
}
