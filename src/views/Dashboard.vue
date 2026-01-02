<template>
  <SideNav>
    <Header>
      <template #title>
        <h1 class="text-2xl font-medium flex items-center">DASHBOARD</h1>
      </template>
    </Header>
    <!-- Cards Section -->
    <div class="p-5 flex flex-row gap-5 flex-wrap bg-gray-100">
      <!-- Completed Payments Card -->
      <div class="bg-[#f8d7b0] rounded-[30px] p-4 flex-1 min-w-[270px]">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <Icon icon="tabler:receipt" class="text-3xl text-[#3e170c]" />
            <span class="text-lg text-[#3e170c] font-poppins"
              >Completed Payments</span
            >
          </div>
        </div>
        <div class="mt-2 text-xl text-[#3e170c] font-poppins text-left">
          85%
        </div>
      </div>

      <!-- No of Members Card -->
      <div class="bg-[#9ee076] rounded-[30px] p-4 flex-1 min-w-[270px]">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <Icon icon="tabler:users" class="text-3xl text-[#3e170c]" />
            <span class="text-lg text-[#3e170c] font-poppins"
              >No of Members</span
            >
          </div>
        </div>
        <div class="mt-2 text-xl text-[#3e170c] font-poppins text-left">
          145
        </div>
      </div>

      <!-- Active Loans Card -->
      <div class="bg-[#f8d7b0] rounded-[30px] p-4 flex-1 min-w-[270px]">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <Icon icon="tabler:coin" class="text-3xl text-[#3e170c]" />
            <span class="text-lg text-[#3e170c] font-poppins"
              >Active Loans</span
            >
          </div>
        </div>
        <div class="mt-2 text-xl text-[#3e170c] font-poppins text-left">
          75
        </div>
      </div>
    </div>

    <!-- Charts and Notifications Section -->
    <div class="p-5 flex flex-row gap-5 bg-gray-100 flex-wrap">
      <!-- Chart 1 Section (Donut Chart) -->
      <div class="bg-white rounded-[30px] p-5 flex-1 min-w-[400px]">
        <div class="text-xl text-[#000000] font-poppins mb-3">Chart 1</div>
        <div class="w-full h-[300px]">
          <!-- Chart.js Donut Chart -->
          <DonutChart :chartData="donutChartData" :chartOptions="donutChartOptions" />
        </div>
        
      </div>

      <!-- Notifications Section -->
      <div class="bg-white rounded-[30px] p-5 flex-1 min-w-[400px]">
        <div class="text-xl text-[#000000] font-poppins mb-3">
          Notifications
        </div>
        <div class="flex flex-col gap-2">
          <!-- Notification Item -->
          <div
            v-for="(notification, index) in notifications"
            :key="index"
            class="rounded-[30px] p-2 flex items-center gap-3"
            :class="notification.bgColor"
          >
            <div
              class="w-4 h-full rounded-l-[30px]"
              :class="notification.sidebarColor"
            ></div>
            <div class="flex-1">
              <div class="text-sm text-[#000000] font-poppins">
                {{ notification.title }}
              </div>
              <div class="text-sm text-[#000000] font-poppins">
                {{ notification.time }}
              </div>
            </div>
            <Icon icon="mi:options-horizontal" class="text-xl text-[#000000]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Chart 2 Section -->
    <div class="p-5 gap-10 bg-gray-100">
      <div class="bg-white rounded-[30px] p-5">
        <div class="text-xl text-[#000000] font-poppins mb-3">Chart 2</div>
        <div class="w-full h-[200px]">
          <!-- Chart.js Line Chart -->
          <LineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />
        </div>
        
      </div>
    </div>
  </SideNav>
</template>

<script>
import SideNav from "../components/SideNav.vue";
import Header from "../components/Header.vue";
import { Icon } from "@iconify/vue"; // Import Iconify
import DonutChart from "../components/DonutChart.vue"; // Import DonutChart
import LineChart from "../components/LineChart.vue"; // Import LineChart

export default {
  name: "Dashboard",
  components: {
    SideNav,
    Header,
    Icon,
    DonutChart,
    LineChart,
  },
  data() {
    return {
      // Notifications Data
      notifications: [
        {
          title: "Withdraw Request",
          time: "21:00 hrs",
          bgColor: "bg-[#f8d7b0]",
          sidebarColor: "bg-[#c86817]",
        },
        {
          title: "Deposit Request",
          time: "22:00 hrs",
          bgColor: "bg-[#9ee076]",
          sidebarColor: "bg-[#459020]",
        },
        {
          title: "Loan Approval",
          time: "23:00 hrs",
          bgColor: "bg-[#f8d7b0]",
          sidebarColor: "bg-[#c86817]",
        },
      ],

      // Donut Chart Data
      donutChartData: {
        labels: ["Members", "Loans", "Payments", "Accounts"],
        datasets: [
          {
            backgroundColor: ["#e77121", "#9ee076", "#d9d9d9", "#f3b97e"],
            data: [44, 55, 41, 17],
          },
        ],
      },
      donutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },

      // Line Chart Data
      lineChartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Series 1",
            backgroundColor: "#e77121",
            borderColor: "#e77121",
            data: [30, 40, 35, 50, 49, 60],
          },
          {
            label: "Series 2",
            backgroundColor: "#9ee076",
            borderColor: "#9ee076",
            data: [20, 30, 25, 40, 39, 50],
          },
        ],
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>

<style>
/* Add Poppins font */
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");

.font-poppins {
  font-family: "Poppins", sans-serif;
}
</style>