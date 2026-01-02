<template>
    <div class="min-h-screen bg-gray-100">
      <SideNav>
        <Header>
          <template #title>
            <h1 class="text-2xl font-medium flex items-center">UPDATE MEMBER</h1>
          </template>
        </Header>
  
        <!-- Loading State -->
        <div v-if="loading" class="p-8 flex justify-center">
          <div class="flex flex-col items-center">
            <IconifyIcon icon="eos-icons:loading" class="w-10 h-10 text-[#ec924b]" />
            <p class="mt-2 text-gray-600">Loading member data...</p>
          </div>
        </div>
  
        <!-- Error State -->
        <div v-else-if="loadError" class="p-8">
          <div class="bg-red-100 text-red-800 p-4 rounded-md">
            <p>{{ loadError }}</p>
            <button 
              @click="fetchMemberData" 
              class="mt-2 text-[#ec924b] hover:underline focus:outline-none"
            >
              Try Again
            </button>
          </div>
        </div>
  
        <!-- Form Container -->
        <div v-else class="p-4">
          <div class="bg-white rounded-lg shadow-sm p-6 mx-auto">
            <!-- Member ID Display -->
            <div class="mb-6 p-3 bg-gray-50 rounded-md">
              <div class="flex items-center">
                <span class="text-sm text-gray-500 mr-2">Member ID:</span>
                <span class="text-sm font-medium">{{ memberId }}</span>
              </div>
            </div>
  
            <!-- Form Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- First Name Field -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">First Name <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  v-model="form.first_name"
                  placeholder="Enter first name"
                  class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                  required
                />
                <span v-if="errors.first_name" class="text-red-500 text-xs">{{ errors.first_name }}</span>
              </div>
  
              <!-- Last Name Field -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Last Name <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  v-model="form.last_name"
                  placeholder="Enter last name"
                  class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                  required
                />
                <span v-if="errors.last_name" class="text-red-500 text-xs">{{ errors.last_name }}</span>
              </div>
  
              <!-- Email Field -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Email Address <span class="text-red-500">*</span></label>
                <input
                  type="email"
                  v-model="form.email"
                  placeholder="Enter email address"
                  class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                  required
                />
                <span v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</span>
              </div>
  
              <!-- Phone Number Field -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  v-model="form.phone"
                  placeholder="Enter phone number"
                  class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                />
                <span v-if="errors.phone" class="text-red-500 text-xs">{{ errors.phone }}</span>
              </div>
  
              <!-- Password Update Field (Optional) -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Password</label>
                <div class="relative">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.password"
                    placeholder="Leave blank to keep current password"
                    class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b] w-full"
                  />
                  <button 
                    type="button" 
                    @click="showPassword = !showPassword" 
                    class="absolute right-2 top-2 text-gray-500"
                    v-if="form.password"
                  >
                    <IconifyIcon 
                      :icon="showPassword ? 'mdi:eye-off' : 'mdi:eye'" 
                      class="w-5 h-5"
                    />
                  </button>
                </div>
                <div class="flex justify-between">
                  <span v-if="errors.password" class="text-red-500 text-xs">{{ errors.password }}</span>
                  <button 
                    type="button" 
                    @click="generatePassword" 
                    class="text-xs text-blue-600 hover:text-blue-800"
                  >Generate New Password</button>
                </div>
              </div>
  
              <!-- Initial Contribution Field -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Net Value <span class="text-red-500">*</span></label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500">K</span>
                  <input
                    type="number"
                    v-model="form.net_value"
                    placeholder="0.00"
                    class="p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <span v-if="errors.net_value" class="text-red-500 text-xs">{{ errors.net_value }}</span>
              </div>
  
              <!-- Status Field -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Status <span class="text-red-500">*</span></label>
                <select
                  v-model="form.status"
                  class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <span v-if="errors.status" class="text-red-500 text-xs">{{ errors.status }}</span>
              </div>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 mt-6">
              <button
                @click="cancel"
                class="bg-[#9ee076] text-[#12290a] px-4 py-2 rounded-md hover:bg-[#8ccf66] transition-colors"
              >
                Cancel
              </button>
              <button
                @click="save"
                class="bg-[#f8d7b0] text-[#12290a] px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#ec924b] transition-colors"
                :disabled="isSubmitting"
              >
                <IconifyIcon :icon="isSubmitting ? 'eos-icons:loading' : 'mdi:content-save'" class="w-5 h-5" />
                <span>{{ isSubmitting ? 'Saving...' : 'Update Member' }}</span>
              </button>
            </div>
  
            <!-- Success/Error Alert -->
            <div v-if="alertMessage" class="mt-4 p-3 rounded-md" :class="alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ alertMessage }}
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
  import { protectedApi } from "../api";
  
  export default defineComponent({
    name: "UpdateMember",
    components: {
      SideNav,
      Header,
      IconifyIcon,
    },
  
    data() {
      return {
        memberId: "",
        form: {
          first_name: "",
          last_name: "",
          email: "",
          password: "", // Optional for update
          phone: "",
          status: "",
          interest: 0.0,
          net_value: null,
        },
        originalMember: null, // To store the original data
        errors: {},
        showPassword: false,
        isSubmitting: false,
        alertMessage: "",
        alertType: "",
        loading: true,
        loadError: null
      };
    },
  
    created() {
      // Get member ID from route
      this.memberId = this.$route.params.id;
      // Fetch member data
      this.fetchMemberData();
    },
  
    methods: {
      async fetchMemberData() {
        this.loading = true;
        this.loadError = null;
  
        try {
          const response = await protectedApi.getMember(this.memberId);
          this.originalMember = response.data;
          
          // Populate form with existing data
          this.form = {
            first_name: this.originalMember.first_name,
            last_name: this.originalMember.last_name,
            email: this.originalMember.email,
            password: "", // Empty by default
            phone: this.originalMember.phone || "",
            status: this.originalMember.status,
            interest: this.originalMember.total_interest,
            net_value: this.originalMember.net_value,
          };
        } catch (error) {
          console.error("Failed to fetch member data:", error);
          this.loadError = "Failed to load member data. Please try again.";
        } finally {
          this.loading = false;
        }
      },
  
      generatePassword() {
        // Generate a secure password (12-16 characters with mixed case, numbers, and special chars)
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        const length = Math.floor(Math.random() * 5) + 12; // Random length between 12-16
        let password = "";
        
        // Ensure at least one of each type of character
        password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
        password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
        password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
        password += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)]; // Special
  
        // Fill remaining length with random chars
        for (let i = 4; i < length; i++) {
          password += charset[Math.floor(Math.random() * charset.length)];
        }
  
        // Shuffle the password
        password = password.split('').sort(() => 0.5 - Math.random()).join('');
        
        this.form.password = password;
        this.showPassword = true; // Show the password by default when generated
        
        // Hide password after 5 seconds
        setTimeout(() => {
          this.showPassword = false;
        }, 5000);
      },
  
      validateForm() {
        this.errors = {};
        let isValid = true;
  
        if (!this.form.first_name.trim()) {
          this.errors.first_name = 'First name is required';
          isValid = false;
        }
  
        if (!this.form.last_name.trim()) {
          this.errors.last_name = 'Last name is required';
          isValid = false;
        }
  
        if (!this.form.email.trim()) {
          this.errors.email = 'Email is required';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
          this.errors.email = 'Please enter a valid email address';
          isValid = false;
        }
  
        // Password validation only if a new password is provided
        if (this.form.password && this.form.password.length < 8) {
          this.errors.password = 'Password must be at least 8 characters long';
          isValid = false;
        }
  
        if (this.form.net_value === null || this.form.net_value === '') {
          this.errors.net_value = 'Net value is required';
          isValid = false;
        } else if (isNaN(this.form.net_value) || parseFloat(this.form.net_value) < 0) {
          this.errors.net_value = 'Please enter a valid amount';
          isValid = false;
        }
  
        if (!this.form.status) {
          this.errors.status = 'Status is required';
          isValid = false;
        }
  
        return isValid;
      },
  
      // Prepare data for update - omit password if not changed
      prepareUpdateData() {
        // Start with a copy of the form data
        const updateData = { ...this.form };
        
        // Convert numeric values
        updateData.net_value = parseFloat(updateData.net_value);
        updateData.interest = parseFloat(updateData.interest);
        
        // Remove password if it's empty (not changed)
        if (!updateData.password) {
          delete updateData.password;
        }
        
        return updateData;
      },
  
      async save() {
        if (!this.validateForm()) {
          return;
        }
  
        this.isSubmitting = true;
        this.alertMessage = "";
  
        try {
          const updateData = this.prepareUpdateData();
          
          const response = await protectedApi.updateMember(this.memberId, updateData);
          
          this.alertType = "success";
          this.alertMessage = "Member updated successfully!";
          
          // If a new password was set, hide it after successful update
          if (this.form.password) {
            this.showPassword = false;
          }
          
          // Update originalMember with new data
          this.originalMember = response.data.member || response.data;
          
          // Redirect after short delay
          setTimeout(() => {
            this.$router.push({ name: 'members' });
          }, 2000);
          
        } catch (error) {
          this.alertType = "error";
          if (error.response && error.response.data && error.response.data.error) {
            this.alertMessage = error.response.data.error;
          } else {
            this.alertMessage = "Failed to update member. Please try again.";
          }
          console.error("Error updating member:", error);
        } finally {
          this.isSubmitting = false;
        }
      },
  
      cancel() {
        // Navigate back to members list
        this.$router.push({ name: 'members' });
      },
    },
  });
  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
  
  .font-poppins {
    font-family: "Poppins", sans-serif;
  }
  
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type=number] {
    -moz-appearance: textfield;
  }
  </style>