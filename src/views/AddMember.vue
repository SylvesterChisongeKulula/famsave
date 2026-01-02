<template>
  <div class="min-h-screen bg-gray-100">
    <SideNav>
      <Header>
        <template #title>
          <h1 class="text-2xl font-medium flex items-center">ADD MEMBER</h1>
        </template>
      </Header>

      <!-- Form Container -->
      <div class="p-4">
        <div class="bg-white rounded-lg shadow-sm p-6 mx-auto">
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

            <!-- Password Field -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700">Password <span class="text-red-500">*</span></label>
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password"
                  placeholder="Password"
                  class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b] w-full"
                  required
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute right-2 top-2 text-gray-500"
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
                >Generate Password</button>
              </div>
            </div>

            <!-- Initial Contribution Field -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700">Initial Contribution <span class="text-red-500">*</span></label>
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
              <IconifyIcon :icon="isSubmitting ? 'eos-icons:loading' : 'material-symbols:add'" class="w-5 h-5" />
              <span>{{ isSubmitting ? 'Saving...' : 'Save' }}</span>
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
  name: "AddMember",
  components: {
    SideNav,
    Header,
    IconifyIcon,
  },

  data() {
    return {
      form: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        status: "active",
        interest: 0.0,
        net_value: null,
      },
      errors: {},
      showPassword: false,
      isSubmitting: false,
      alertMessage: "",
      alertType: "",
    };
  },

  created() {
    // Generate a secure password when the component is created
    this.generatePassword();
  },

  methods: {
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

      if (!this.form.password.trim()) {
        this.errors.password = 'Password is required';
        isValid = false;
      } else if (this.form.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters long';
        isValid = false;
      }

      if (this.form.net_value === null || this.form.net_value === '') {
        this.errors.net_value = 'Initial contribution is required';
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

    async save() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      this.alertMessage = "";

      try {
        // Ensure interest is 0.0 before submitting
        this.form.interest = 0.0;
        
        // Convert net_value to number
        this.form.net_value = parseFloat(this.form.net_value);
        
        const response = await protectedApi.createMember(this.form);
        
        this.alertType = "success";
        this.alertMessage = "Member created successfully!";
        
        // Reset form after successful submission
        setTimeout(() => {
          this.resetForm();
          // Optionally redirect to members list
          this.$router.push({ name: 'members' });
        }, 2000);
        
      } catch (error) {
        this.alertType = "error";
        if (error.response && error.response.data && error.response.data.error) {
          this.alertMessage = error.response.data.error;
        } else {
          this.alertMessage = "Failed to create member. Please try again.";
        }
        console.error("Error creating member:", error);
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.form = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        status: "active",
        interest: 0.0,
        net_value: null,
      };
      this.errors = {};
      this.generatePassword();
    },

    cancel() {
      // Navigate back or to members list
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