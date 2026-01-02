<template>
  <div class="flex min-h-screen">
    <!-- Mobile overlay -->
    <div 
      class="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50" 
      v-if="showMenu" 
      @click="showMenu = false"
    ></div>

    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 h-screen transition-transform duration-300 md:translate-x-0 -translate-x-full z-20"
      :class="{ '-translate-x-full': !showMenu, 'translate-x-0': showMenu }"
    >
      <div class="h-full bg-gray-100 flex flex-col gap-5 w-[253px] p-2.5">
        <!-- Logo -->
        <img class="h-[172px] object-cover" src="../assets/imgs/famsavelogo.jpg" />
        
        <!-- Menu Items -->
        <div class="flex flex-col gap-[25px] flex-1">
          <router-link
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.route"
            custom
            v-slot="{ navigate }"
          >
            <div
              :class="[
                'rounded-sm flex flex-row gap-2.5 items-center px-2.5 h-[33px] cursor-pointer',
                item.active ? 'bg-[#ec924b]' : 'bg-[#f8d7b0]',
              ]"
              @click="setActive(index); navigate()"
            >
              <img class="w-5 h-5" :src="item.icon" />
              <div class="text-[#12290a] text-sm font-['Poppins-Regular',_sans-serif]">
                {{ item.label }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col items-start justify-start z-1 relative md:pl-[253px] overflow-hidden">
      <!-- Mobile Header -->
      <div
        class="bg-[#e4e4e4] md:hidden flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-30 h-16"
      >
        <img class="ml-4 h-12 object-cover" alt="Logo" src="../assets/imgs/famsavelogo.png" />
        <button 
          @click="showMenu = !showMenu"
          class="flex items-center px-4 py-2 text-[#12290a] hover:text-[#ec924b] hover:ease-in duration-300"
        >
          <svg v-if="!showMenu" class="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
          <svg v-else class="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </button>
      </div>

      <!-- Page Content -->
      <div class="w-full pt-16 md:pt-0">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
// Import all your icons
import HomeIcon from "../assets/icons/tabler_home.svg";
import MembersIcon from "../assets/icons/tabler_users.svg";
import LoansIcon from "../assets/icons/tabler_cash.svg";
import PaymentsIcon from "../assets/icons/tabler_receipt.svg";
import DisbursementsIcon from "../assets/icons/tabler_transfer.svg";
import NotificationsIcon from "../assets/icons/tabler_bell.svg";
import SettingsIcon from "../assets/icons/tabler_settings.svg";
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: "SideNav",
  setup() {
    const showMenu = ref(false);
    const router = useRouter();
    const route = useRoute();
    
    const menuItems = ref([
      { label: "Home", active: false, icon: HomeIcon, route: "/dashboard" },
      { label: "Members", active: false, icon: MembersIcon, route: "/members" },
      { label: "Loans", active: false, icon: LoansIcon, route: "/loans" },
      { label: "Payments", active: false, icon: PaymentsIcon, route: "/payments" },
      { label: "Disbursements", active: false, icon: DisbursementsIcon, route: "/disbursements" },
      { label: "Notifications", active: false, icon: NotificationsIcon, route: "/notifications" },
      { label: "Settings", active: false, icon: SettingsIcon, route: "/settings" },
    ]);

    // Set active menu item based on current route
    const updateActiveMenuItem = () => {
      const currentPath = route.path;
      menuItems.value.forEach((item, index) => {
        if (item.route === currentPath) {
          setActive(index);
        }
      });
    };

    const setActive = (index) => {
      menuItems.value.forEach((item, i) => {
        item.active = i === index;
      });
      
      // Close menu on mobile after selection
      if (window.innerWidth < 768) {
        showMenu.value = false;
      }
    };

    // Update active menu item when component is mounted
    onMounted(() => {
      updateActiveMenuItem();
    });

    return {
      showMenu,
      menuItems,
      setActive
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.font-poppins {
  font-family: 'Poppins', sans-serif;
}
</style>