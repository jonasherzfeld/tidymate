import Chart from "chart.js/auto";

export function BarChart(node: HTMLElement, config: any) {
  let chart: Chart;
  let canvas: HTMLCanvasElement;

  function createChart() {
    if (chart) {
      chart.destroy();
    }

    // Clear the node and create a new canvas
    node.innerHTML = "";
    canvas = document.createElement("canvas");
    node.appendChild(canvas);

    if (config.datasets?.length > 0) {
      chart = new Chart(canvas, {
        // ← Use canvas, not node
        type: "bar",
        data: {
          labels: config.labels,
          datasets: config.datasets
        },
        options: config.options || {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  createChart();

  return {
    update(newConfig: any) {
      if (chart) {
        // Update the chart data directly
        chart.data.labels = newConfig.labels;
        chart.data.datasets = newConfig.datasets;

        // Re-render the chart
        chart.update("none");
      } else {
        // If chart doesn't exist, create it
        config = newConfig;
        createChart();
      }
    },
    destroy() {
      if (chart) {
        chart.destroy();
      }
    }
  };
}
