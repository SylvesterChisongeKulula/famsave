<template>
    <div class="min-h-screen bg-gray-100">
      <SideNav>
        <Header>
          <template #title>
            <h1 class="text-2xl font-medium flex items-center">NOTIFICATIONS</h1>
          </template>
        </Header>
  
        <div class="p-4 flex flex-row items-center justify-between gap-2 bg-gray-100">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-md">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconifyIcon icon="heroicons-outline:search" class="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                class="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-400 text-sm"
              />
            </div>
          </div>
  
          <!-- Date Filter -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <select
                v-model="selectedMonth"
                class="appearance-none pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400 bg-white"
              >
                <option value="">January 12</option>
                <option value="feb">February</option>
                <option value="mar">March</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <IconifyIcon icon="heroicons-solid:chevron-down" class="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <button class="border border-gray-300 rounded-md p-2 hover:bg-gray-50">
              <IconifyIcon icon="heroicons-outline:x" class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
  
        <!-- Tabs -->
        <div class="bg-white mx-4 rounded-t-lg">
          <div class="grid grid-cols-3 gap-0">
            <div 
              class="py-4 px-6 text-center font-semibold cursor-pointer"
              :class="activeTab === 'unread' ? 'bg-orange-400 text-white rounded-t-lg' : 'text-black'"
              @click="setActiveTab('unread')"
            >
              UNREAD
            </div>
            <div 
              class="py-4 px-6 text-center font-semibold cursor-pointer"
              :class="activeTab === 'read' ? 'bg-orange-400 text-white' : 'text-black'"
              @click="setActiveTab('read')"
            >
              READ
            </div>
            <div 
              class="py-4 px-6 text-center font-semibold cursor-pointer"
              :class="activeTab === 'archive' ? 'bg-orange-400 text-white' : 'text-black'"
              @click="setActiveTab('archive')"
            >
              ARCHIVE
            </div>
          </div>
        </div>
  
        <!-- Notification List -->
        <div class="bg-white mx-4 mb-4 rounded-b-lg shadow">
          <div v-for="(notification, index) in filteredNotifications" :key="index" 
            class="border-b border-gray-100 last:border-0 p-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-8 h-8 flex-shrink-0">
                <IconifyIcon icon="mdi:bell-outline" class="w-6 h-6 text-green-600" />
              </div>
              <div class="font-normal text-base">{{ notification.message }}</div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-sm text-gray-500">{{ notification.time }}</div>
              <button 
                v-if="activeTab === 'unread'"
                class="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 rounded text-sm"
              >
                Mark as Read
              </button>
            </div>
          </div>
        </div>
      </SideNav>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import SideNav from "../components/SideNav.vue";
  import Header from "../components/Header.vue";
  import { Icon as IconifyIcon } from "@iconify/vue";
  
  export default defineComponent({
    name: "Notifications",
    components: {
      SideNav,
      Header,
      IconifyIcon,
    },
    data() {
      return {
        selectedMonth: "",
        activeTab: "unread",
        notifications: [
          { 
            id: 1, 
            status: "unread", 
            message: "Payment Made By Member 1.", 
            time: "7 hrs Ago" 
          },
          { 
            id: 2, 
            status: "unread", 
            message: "Withdraw Request By Member 2.", 
            time: "7 hrs Ago" 
          },
          { 
            id: 3, 
            status: "unread", 
            message: "Member 3 Loan Overdue by 2 days.", 
            time: "7 hrs Ago" 
          },
          { 
            id: 4, 
            status: "read", 
            message: "New Member Joined.", 
            time: "1 day Ago" 
          },
          { 
            id: 5, 
            status: "read", 
            message: "System Maintenance Scheduled.", 
            time: "2 days Ago" 
          },
          { 
            id: 6, 
            status: "archive", 
            message: "Financial Report Generated.", 
            time: "1 week Ago" 
          }
        ]
      };
    },
    computed: {
      filteredNotifications() {
        return this.notifications.filter(notification => notification.status === this.activeTab);
      }
    },
    methods: {
      setActiveTab(tab) {
        this.activeTab = tab;
      },
      markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.status = "read";
        }
      },
      archiveNotification(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.status = "archive";
        }
      }
    }
  });
  </script>