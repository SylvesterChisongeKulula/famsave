<template>
    <div class="min-h-screen bg-gray-100">
      <SideNav>
        <Header>
          <template #title>
            <h1 class="text-2xl font-medium flex items-center">SETTINGS</h1>
          </template>
        </Header>
  
        <div class="p-6 bg-gray-100">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div>
                <!-- Username -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    v-model="settings.username"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
  
                <!-- Confirm Password -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div class="relative">
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      v-model="settings.confirmPassword"
                      class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400 pr-10"
                    />
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <IconifyIcon 
                        :icon="showConfirmPassword ? 'heroicons-solid:eye' : 'heroicons-solid:eye-off'" 
                        class="h-5 w-5 text-gray-500"
                      />
                    </button>
                  </div>
                </div>
  
                <!-- Interest Rate -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate
                  </label>
                  <input
                    type="text"
                    v-model="settings.interestRate"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
  
                <!-- Member Ban Period -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Member Ban Period (Days)
                  </label>
                  <input
                    type="number"
                    v-model="settings.memberBanPeriod"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
              </div>
  
              <!-- Right Column -->
              <div>
                <!-- Phone Number -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    v-model="settings.phoneNumber"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
  
                <!-- Password -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div class="relative">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      v-model="settings.password"
                      class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400 pr-10"
                    />
                    <button
                      type="button"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      @click="showPassword = !showPassword"
                    >
                      <IconifyIcon 
                        :icon="showPassword ? 'heroicons-solid:eye' : 'heroicons-solid:eye-off'" 
                        class="h-5 w-5 text-gray-500"
                      />
                    </button>
                  </div>
                </div>
  
                <!-- Default Grace Period -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Default Grace Period (days)
                  </label>
                  <input
                    type="number"
                    v-model="settings.defaultGracePeriod"
                    class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
  
                <!-- Save Button -->
                <div class="mt-8 flex justify-end">
                  <button
                    @click="saveSettings"
                    class="bg-orange-100 hover:bg-orange-200 px-6 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <IconifyIcon icon="material-symbols:save" class="w-5 h-5 text-orange-800" />
                    <span class="text-orange-800 font-normal">Save</span>
                  </button>
                </div>
              </div>
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
    name: "Settings",
    components: {
      SideNav,
      Header,
      IconifyIcon,
    },
    data() {
      return {
        showPassword: false,
        showConfirmPassword: false,
        settings: {
          username: "Sylvester",
          confirmPassword: "**************",
          interestRate: "12%",
          memberBanPeriod: 30,
          phoneNumber: "+260978234457",
          password: "*******************",
          defaultGracePeriod: 5
        }
      };
    },
    methods: {
      saveSettings() {
        // Logic to save settings
        console.log("Settings saved:", this.settings);
        // Here you would typically make an API call to save the settings
      }
    }
  });
  </script>