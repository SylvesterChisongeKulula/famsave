<template>
  <header class="p-5 flex items-center justify-between w-full bg-gray-100">
    <!-- Page Title -->
    <h1 class="text-[#000000] font-medium text-lg md:text-xl font-inter">
      <slot name="title">DASHBOARD</slot>
    </h1>

    <!-- Profile Section -->
    <div class="relative profile-dropdown">
      <button
        @click="toggleProfileMenu"
        class="flex items-center space-x-2 focus:outline-none"
        aria-label="Profile options"
      >
        <!-- User Info (only visible on larger screens) -->
        <div class="hidden sm:flex sm:flex-col sm:items-end">
          <span class="text-sm font-medium text-gray-900">{{ userDisplayName }}</span>
          <span class="text-xs text-gray-600">{{ userRole }}</span>
        </div>
        
        <!-- Profile Icon -->
        <div class="relative flex items-center justify-center w-10 h-10 bg-orange-600 text-white rounded-full border-2 border-white shadow">
          <span v-if="!userInfo?.profile_image" class="text-sm font-semibold">{{ userInitials }}</span>
          <img 
            v-else 
            :src="userInfo.profile_image" 
            alt="Profile" 
            class="w-full h-full rounded-full object-cover" 
          />
        </div>
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showProfileMenu"
        class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50"
      >
        <!-- User Info Section (mobile view) -->
        <div class="px-4 py-3 border-b border-gray-200 sm:hidden">
          <p class="text-sm font-medium text-gray-900">{{ userDisplayName }}</p>
          <p class="text-xs text-gray-600">{{ userRole }}</p>
        </div>
        
        <!-- Menu Items -->
        <div class="py-1">
          <button
            @click="navigateTo('profile')"
            class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            Profile
          </button>
          
          <button
            @click="navigateTo('settings')"
            class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
            Settings
          </button>
        </div>
        
        <div class="border-t border-gray-200">
          <button
            @click="handleLogout"
            class="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            <svg class="mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm6 5a1 1 0 100 2h1.586l-2.293 2.293a1 1 0 001.414 1.414L12 9.414V11a1 1 0 102 0V7.5a.5.5 0 00-.5-.5H9z" clip-rule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <!-- Overlay to close dropdown when clicking outside -->
      <div
        v-if="showProfileMenu"
        class="fixed inset-0 z-40"
        @click="showProfileMenu = false"
      ></div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { protectedApi } from '../api';
import store from '../store';

export default {
  name: 'AppHeader',
  emits: ['navigate'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const showProfileMenu = ref(false);

    // Get user info from store
    const userInfo = computed(() => store.state.auth.userInfo || {});
    const adminData = ref(null);
    
    // Load admin data on component mount
    onMounted(async () => {
      if (userInfo.value && userInfo.value.user_id) {
        try {
          const response = await protectedApi.getAdmin(userInfo.value.user_id);
          adminData.value = response.data;
        } catch (error) {
          console.error('Error fetching admin data:', error);
        }
      }
    });
    
    // Computed properties for user display
    const userDisplayName = computed(() => {
      // First try to use adminData if available
      if (adminData.value) {
        return `${adminData.value.first_name} ${adminData.value.last_name}`;
      }
      
      if (!userInfo.value) return 'Guest User';
      
      // If we have first_name/last_name properties
      if (userInfo.value.first_name && userInfo.value.last_name) {
        return `${userInfo.value.first_name} ${userInfo.value.last_name}`;
      }
      
      // Otherwise use user_id or a default
      return 'Admin';
    });
    
    const userInitials = computed(() => {
      // If admin data is available, use it
      if (adminData.value) {
        return (adminData.value.first_name[0] + adminData.value.last_name[0]).toUpperCase();
      }
      
      // If no user info, return default
      if (!userInfo.value) return 'U';
      
      // If we have first_name and last_name
      if (userInfo.value.first_name && userInfo.value.last_name) {
        return (userInfo.value.first_name[0] + userInfo.value.last_name[0]).toUpperCase();
      }
      
      // If we have user_id but no name, use first letter of user_id
      return userInfo.value.user_id ? userInfo.value.user_id[0].toUpperCase() : 'U';
    });
    
    const userRole = computed(() => {
      if (!userInfo.value) return '';
      
      // Format role or user type for display
      const role = userInfo.value.role || userInfo.value.user_type;
      if (!role) return '';
      
      // Capitalize and format role
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    });

    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value;
    };

    const navigateTo = (destination) => {
      emit('navigate', destination);
      if (destination === 'settings') {
        router.push('/settings');
      } else if (destination === 'profile') {
        router.push('/profile');
      }
      showProfileMenu.value = false;
    };
    
    const handleLogout = async () => {
      try {
        // Call the logout action with proper namespacing
        await store.dispatch('logout');
        
        // Force close the menu
        showProfileMenu.value = false;
        
        // Show success notification
        store.dispatch('showSuccessNotification', 'You have been logged out successfully');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 300);
      } catch (error) {
        console.error('Logout error:', error);
        store.dispatch('showErrorNotification', 'There was a problem logging out');
      }
    };

    // Close dropdown when clicking outside
    const closeOnOutsideClick = (e) => {
      const dropdown = document.querySelector('.profile-dropdown');
      if (showProfileMenu.value && dropdown && !dropdown.contains(e.target)) {
        showProfileMenu.value = false;
      }
    };

    // Add event listener for document clicks
    onMounted(() => {
      document.addEventListener('click', closeOnOutsideClick);
    });

    // Clean up event listener
    onUnmounted(() => {
      document.removeEventListener('click', closeOnOutsideClick);
    });

    return {
      userInfo,
      userDisplayName,
      userInitials,
      userRole,
      showProfileMenu,
      toggleProfileMenu,
      navigateTo,
      handleLogout
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>