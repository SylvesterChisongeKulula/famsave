<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-4">
      <div class="bg-white rounded-lg overflow-hidden w-full max-w-md shadow-lg">
        <div class="px-6 pt-6 space-y-6 items-center text-center">
          <div class="relative w-40 h-40 mx-auto">
            <img
              src="../assets/imgs/famsavelogo.jpg"
              alt="Family Affairs Savings and Credit Co-operative Logo"
              class="object-contain absolute inset-0 w-full h-full"
            />
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-orange-600">Welcome Back</h2>
            <p class="text-gray-500">Sign in to your account</p>
          </div>
        </div>
        
        <div class="space-y-4 p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <label for="email" class="block font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                required
                :disabled="isLoading"
                placeholder="name@example.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div class="space-y-2">
              <label for="password" class="block font-medium text-gray-700">Password</label>
              <div class="relative">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="password" 
                  required
                  :disabled="isLoading"
                  placeholder="••••••••"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button 
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-gray-500"
                  @click="togglePasswordVisibility"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span class="sr-only">{{ showPassword ? "Hide password" : "Show password" }}</span>
                </button>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember-me" 
                  class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" class="text-sm text-orange-600 hover:underline">Forgot password?</a>
            </div>
            
            <div v-if="error" class="mt-4 text-red-600 bg-red-100 p-3 rounded-md text-sm">
              {{ error }}
            </div>
            
            <div class="mt-6">
              <button 
                type="submit" 
                class="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors font-medium"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Signing in...</span>
                <span v-else>Sign In</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '../store';

export default {
  name: 'LoginPage',
  
  setup() {
  //   const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    // Form data
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    
    // Computed properties - accessing the auth module namespaced getters
    const isLoading = computed(() => store.state.auth.loading);
    const error = computed(() => store.state.auth.error);
    const isAuthenticated = computed(() => store.state.auth.isAuthenticated);
    
    // Check if user is already logged in
    if (isAuthenticated.value) {
      router.push('/dashboard');
    }
    
    // Methods
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    
    const handleLogin = async () => {
      if (!email.value || !password.value) {
        // Use the global notification system
        store.dispatch('showErrorNotification', 'Please enter both email and password');
        return;
      }
      
      try {
        const response = await store.dispatch('login', { 
          email: email.value, 
          password: password.value 
        });
        
        // Show success notification
        store.dispatch('showSuccessNotification', 'Login successful');
        
        // Redirect to the intended page or dashboard
        const redirectPath = route.query.redirect || '/dashboard';
        router.push(redirectPath);
        
        return response;
      } catch (err) {
        // Error handling is managed by the store, but we can also show a notification
        console.error('Login failed:', err);
        
        // If the store didn't set an error message, set a generic one
        if (!store.getters.authError) {
          store.dispatch('showErrorNotification', 'Login failed. Please check your credentials and try again.');
        }
      }
    };
    
    // Clear any previous error on component mount
    onMounted(() => {
      store.commit('auth/setError', null);
      
      // Clear any existing auth if we're on the login page
      // (optional, depending on your use case)
      if (!route.query.redirect) {
        store.commit('auth/clearAuth');
      }
    });
    
    return {
      email,
      password,
      showPassword,
      isLoading,
      error,
      isAuthenticated,
      togglePasswordVisibility,
      handleLogin
    };
  }
};
</script>

<!-- No custom CSS - using Tailwind only -->