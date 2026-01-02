<template>
    <div>
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script>
  import { Doughnut } from 'vue-chartjs';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  export default {
    name: 'DonutChart',
    components: { Doughnut },
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
  };
  </script>