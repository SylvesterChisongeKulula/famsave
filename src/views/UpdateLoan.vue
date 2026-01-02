<template>
    <div class="min-h-screen bg-gray-100">
      <SideNav>
        <Header>
          <template #title>
            <h1 class="text-2xl font-medium flex items-center">UPDATE LOAN</h1>
          </template>
        </Header>
  
        <!-- Form Container -->
        <div class="p-4">
          <div class="bg-white rounded-lg shadow-sm p-6 mx-auto">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center p-8">
              <IconifyIcon icon="eos-icons:loading" class="w-10 h-10 text-[#ec924b]" />
              <span class="ml-2 text-gray-600">Loading loan data...</span>
            </div>
  
            <!-- Error State -->
            <div v-else-if="error" class="p-4 bg-red-100 text-red-800 rounded-md mb-4">
              <p>{{ error }}</p>
              <button 
                @click="fetchData" 
                class="mt-2 text-[#ec924b] hover:underline focus:outline-none"
              >
                Try Again
              </button>
            </div>
  
            <div v-else>
              <!-- Loan ID Display -->
              <div class="mb-6 p-3 bg-gray-50 rounded-md">
                <div class="flex items-center">
                  <span class="text-sm text-gray-500 mr-2">Loan ID:</span>
                  <span class="text-sm font-medium">{{ loanId }}</span>
                </div>
              </div>
              
              <!-- Form Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Member Selection -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Member <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <input
                      type="text"
                      v-model="memberSearchQuery"
                      @input="filterMembers"
                      @focus="showMemberList = true"
                      placeholder="Search for member by name or email"
                      class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b] w-full"
                    />
                    <div 
                      v-if="showMemberList && filteredMembers.length > 0" 
                      class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div 
                        v-for="member in filteredMembers" 
                        :key="member.id"
                        @click="selectMember(member)"
                        class="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div class="font-medium">{{ member.first_name }} {{ member.last_name }}</div>
                        <div class="text-xs text-gray-500">{{ member.email }}</div>
                      </div>
                    </div>
                    <div v-else-if="showMemberList && memberSearchQuery && filteredMembers.length === 0" class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
                      <p class="text-sm text-gray-500">No members found</p>
                    </div>
                  </div>
                  <div v-if="selectedMember" class="mt-2 p-2 bg-gray-50 rounded-md">
                    <div class="flex justify-between items-center">
                      <div>
                        <div class="font-medium">{{ selectedMember.first_name }} {{ selectedMember.last_name }}</div>
                        <div class="text-xs text-gray-500">{{ selectedMember.email }}</div>
                      </div>
                      <button @click="clearSelectedMember" class="text-gray-500 hover:text-red-500">
                        <IconifyIcon icon="mdi:close" class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <span v-if="errors.member_id" class="text-red-500 text-xs">{{ errors.member_id }}</span>
                </div>
  
                <!-- Due Date Field -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Due Date <span class="text-red-500">*</span></label>
                  <input
                    type="date"
                    v-model="form.due_date"
                    class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                  />
                  <span v-if="errors.due_date" class="text-red-500 text-xs">{{ errors.due_date }}</span>
                </div>
  
                <!-- Status Field -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Status <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.status"
                    class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="issued">Issued</option>
                    <option value="rejected">Rejected</option>
                    <option value="paid">Paid</option>
                    <option value="defaulted">Defaulted</option>
                  </select>
                  <span v-if="errors.status" class="text-red-500 text-xs">{{ errors.status }}</span>
                </div>
  
                <!-- Amount Field -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Amount <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">K</span>
                    <input
                      type="number"
                      v-model="form.amount"
                      placeholder="0.00"
                      class="p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <span v-if="errors.amount" class="text-red-500 text-xs">{{ errors.amount }}</span>
                </div>
                
                <!-- Balance Field (Read-only) -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Current Balance</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">K</span>
                    <input
                      type="number"
                      v-model="form.balance"
                      class="p-2 pl-8 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                      readonly
                    />
                  </div>
                  <span class="text-xs text-gray-500">Balance is calculated from payments</span>
                </div>
                
                <!-- Amount Due Field (Read-only) -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Amount Due</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">K</span>
                    <input
                      type="number"
                      v-model="form.amount_due"
                      class="p-2 pl-8 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                      readonly
                    />
                  </div>
                  <span class="text-xs text-gray-500">Calculated with interest</span>
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
                  :disabled="isSubmitting"
                  class="bg-[#f8d7b0] text-[#12290a] px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#ec924b] transition-colors"
                >
                  <IconifyIcon :icon="isSubmitting ? 'eos-icons:loading' : 'mdi:content-save'" class="w-5 h-5" />
                  <span>{{ isSubmitting ? 'Updating...' : 'Update Loan' }}</span>
                </button>
              </div>
  
              <!-- Success/Error Alert -->
              <div v-if="alertMessage" class="mt-4 p-3 rounded-md" :class="alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ alertMessage }}
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
  import { protectedApi } from "../api";
  import auth from "../store/auth";

  export default defineComponent({
    name: "UpdateLoan",
    components: {
      SideNav,
      Header,
      IconifyIcon,
    },
    data() {
      return {
        loanId: null,
        form: {
          member_id: "",
          amount: null,
          status: "",
          due_date: "",
          balance: null,
          amount_due: null,
        },
        originalLoanData: null,
        errors: {},
        members: [],
        filteredMembers: [],
        selectedMember: null,
        memberSearchQuery: "",
        showMemberList: false,
        loading: true,
        error: null,
        isSubmitting: false,
        alertMessage: "",
        alertType: "",
      };
    },
    created() {
      // Get loan ID from route
      this.loanId = this.$route.params.id;
      // Fetch loan and members data
      this.fetchData();
    },
    mounted() {
      // Close member dropdown when clicking outside
      document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
      // Remove event listener when component is unmounted
      document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
      // Format date to YYYY-MM-DD
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      },
      
      // Handle click outside member dropdown
      handleClickOutside(event) {
        const dropdown = this.$el.querySelector('.relative');
        if (dropdown && !dropdown.contains(event.target)) {
          this.showMemberList = false;
        }
      },
      
      // Fetch loan and members data
      async fetchData() {
        this.loading = true;
        this.error = null;
        
        try {
          // Fetch loan data
          const [loanResponse, membersResponse] = await Promise.all([
            protectedApi.getLoan(this.loanId),
            protectedApi.getMembers()
          ]);
          
          // Store loan data
          this.originalLoanData = loanResponse.data;
          
          // Set form data
          this.form = {
            member_id: this.originalLoanData.member.id,
            amount: this.originalLoanData.amount,
            status: this.originalLoanData.status,
            due_date: this.formatDate(this.originalLoanData.due_date),
            balance: this.originalLoanData.balance,
            amount_due: this.originalLoanData.amount_due,
          };
          
          // Store members and set selected member
          this.members = membersResponse.data;
          this.filteredMembers = [...this.members];
          
          // Set selected member and search query
          const memberData = this.members.find(m => m.id === this.form.member_id);
          if (memberData) {
            this.selectedMember = memberData;
            this.memberSearchQuery = `${memberData.first_name} ${memberData.last_name}`;
          }
          
        } catch (err) {
          console.error("Failed to fetch data:", err);
          this.error = "Failed to load loan data. Please try again.";
        } finally {
          this.loading = false;
        }
      },
      
      // Filter members based on search query
      filterMembers() {
        if (!this.memberSearchQuery) {
          this.filteredMembers = [...this.members];
          return;
        }
        
        const query = this.memberSearchQuery.toLowerCase();
        this.filteredMembers = this.members.filter(member => {
          const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
          const email = member.email.toLowerCase();
          return fullName.includes(query) || email.includes(query);
        });
      },
      
      // Select a member
      selectMember(member) {
        this.selectedMember = member;
        this.form.member_id = member.id;
        this.memberSearchQuery = `${member.first_name} ${member.last_name}`;
        this.showMemberList = false;
      },
      
      // Clear selected member
      clearSelectedMember() {
        this.selectedMember = null;
        this.form.member_id = "";
        this.memberSearchQuery = "";
      },
      
      // Validate form
      validateForm() {
        this.errors = {};
        let isValid = true;
        
        if (!this.form.member_id) {
          this.errors.member_id = "Please select a member";
          isValid = false;
        }
        
        if (!this.form.amount) {
          this.errors.amount = "Amount is required";
          isValid = false;
        } else if (isNaN(this.form.amount) || parseFloat(this.form.amount) <= 0) {
          this.errors.amount = "Please enter a valid amount";
          isValid = false;
        }
        
        if (!this.form.due_date) {
          this.errors.due_date = "Due date is required";
          isValid = false;
        }
        
        if (!this.form.status) {
          this.errors.status = "Status is required";
          isValid = false;
        }
        
        return isValid;
      },
      
      // Save updated loan
      async save() {
        if (!this.validateForm()) {
          return;
        }
        
        this.isSubmitting = true;
        this.alertMessage = "";
        
        try {
          // Prepare data for submission
          const loanData = {
            member_id: this.form.member_id,
            amount: parseFloat(this.form.amount),
            status: this.form.status,
            due_date: new Date(this.form.due_date).toISOString(),
            // Use the authenticated user's ID from auth state
            admin_id: auth.state.userInfo.user_id
          };
          
          const response = await protectedApi.updateLoan(this.loanId, loanData);
          
          this.alertType = "success";
          this.alertMessage = "Loan updated successfully!";
          
          // Update local data with response
          this.originalLoanData = response.data.loan || response.data;
          
          // Redirect after short delay
          setTimeout(() => {
            this.$router.push({ name: 'loans' });
          }, 2000);
        } catch (error) {
          this.alertType = "error";
          if (error.response && error.response.data && error.response.data.error) {
            this.alertMessage = error.response.data.error;
          } else {
            this.alertMessage = "Failed to update loan. Please try again.";
          }
          console.error("Error updating loan:", error);
        } finally {
          this.isSubmitting = false;
        }
      },
      
      // Cancel and go back
      cancel() {
        this.$router.push({ name: 'loans' });
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
