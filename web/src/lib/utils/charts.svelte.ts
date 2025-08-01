import Chart from "chart.js/auto";



export function BarChart(node: HTMLElement, data: any) {
  const canvas = document.createElement('canvas');
  node.appendChild(canvas);
  
  const chartInstance = new Chart(canvas, {
    type: "bar",
    data: data,
    options: data.options || {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  return {
    destroy() {
      if (chartInstance) {
        chartInstance.destroy();
      }
    }
  };
}

export function PieChart(node: HTMLElement, data: any) {
  const canvas = document.createElement('canvas');
  node.appendChild(canvas);
  
  // Initialize Chart.js on the canvas
  const chartInstance = new Chart(canvas, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      }
    }
  );

  // Cleanup function
  return {
    destroy() {
      if (chartInstance) {
        chartInstance.destroy();
      }
    }
  };
}
