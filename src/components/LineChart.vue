<template>
    <div class="w-full h-full">
      <Line :data="chartData" :options="mergedOptions" />
    </div>
  </template>
  
  <script>
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
  
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  
  export default {
    name: 'LineChart',
    components: { Line },
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      chartOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    computed: {
      mergedOptions() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          ...this.chartOptions,
        };
      },
    },
  };
  </script>