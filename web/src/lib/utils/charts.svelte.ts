import type { Chart as ChartType, ChartConfiguration } from "chart.js";

type ChartCtor = typeof import("chart.js").Chart;

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
