<template>
    <div class="min-h-screen bg-gray-100">
      <SideNav>
        <Header>
          <template #title>
            <h1 class="text-2xl font-medium flex items-center">NEW DISBURSEMENT</h1>
          </template>
        </Header>
  
        <!-- Form Container -->
        <div class="p-4">
          <div class="bg-white rounded-lg shadow-sm p-6 mx-auto">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center p-8">
              <IconifyIcon icon="eos-icons:loading" class="w-10 h-10 text-[#ec924b]" />
              <span class="ml-2 text-gray-600">Loading members data...</span>
            </div>
  
            <!-- Error State -->
            <div v-else-if="error" class="p-4 bg-red-100 text-red-800 rounded-md mb-4">
              <p>{{ error }}</p>
              <button 
                @click="fetchMembers" 
                class="mt-2 text-[#ec924b] hover:underline focus:outline-none"
              >
                Try Again
              </button>
            </div>
  
            <div v-else>
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
  
                <!-- Loan Selection -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Loan <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <select
                      v-model="form.loan_id"
                      class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b] w-full"
                      :disabled="!selectedMember || loadingLoans"
                    >
                      <option value="" disabled selected>{{ loanSelectPlaceholder }}</option>
                      <option 
                        v-for="loan in memberLoans" 
                        :key="loan.id" 
                        :value="loan.id"
                      >
                        ID: {{ loan.id }} - Amount: K{{ loan.amount.toFixed(2) }}
                      </option>
                    </select>
                    <div v-if="loadingLoans" class="absolute right-2 top-2">
                      <IconifyIcon icon="eos-icons:loading" class="w-5 h-5 text-[#ec924b]" />
                    </div>
                  </div>
                  <span v-if="errors.loan_id" class="text-red-500 text-xs">{{ errors.loan_id }}</span>
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
  
                <!-- Status Field -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Status <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.status"
                    class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  <span v-if="errors.status" class="text-red-500 text-xs">{{ errors.status }}</span>
                </div>
  
                <!-- Disbursement Method -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Method <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.method"
                    class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="cheque">Cheque</option>
                  </select>
                  <span v-if="errors.method" class="text-red-500 text-xs">{{ errors.method }}</span>
                </div>
  
                <!-- Reference Number -->
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium text-gray-700">Reference Number</label>
                  <input
                    type="text"
                    v-model="form.reference_number"
                    placeholder="e.g. TRF-2025041501"
                    class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                  />
                  <span v-if="errors.reference_number" class="text-red-500 text-xs">{{ errors.reference_number }}</span>
                </div>
              </div>
  
              <!-- Notes Field -->
              <div class="mt-6 flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  v-model="form.notes"
                  placeholder="Additional notes about the disbursement"
                  class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b] min-h-[100px]"
                ></textarea>
                <span v-if="errors.notes" class="text-red-500 text-xs">{{ errors.notes }}</span>
              </div>
  
              <!-- Loan Details Card (if a loan is selected) -->
              <div v-if="selectedLoan" class="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 class="font-medium text-gray-700 mb-2">Selected Loan Details:</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Loan ID: <span class="font-medium">{{ selectedLoan.id }}</span></p>
                    <p class="text-sm text-gray-600">Amount: <span class="font-medium">K{{ selectedLoan.amount.toFixed(2) }}</span></p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Status: <span class="font-medium">{{ selectedLoan.status.toUpperCase() }}</span></p>
                    <p class="text-sm text-gray-600">Disbursed At: <span class="font-medium">{{ selectedLoan.disbursed_at ? formatDisplayDate(selectedLoan.disbursed_at) : 'Not disbursed' }}</span></p>
                  </div>
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
                  <IconifyIcon :icon="isSubmitting ? 'eos-icons:loading' : 'material-symbols:add'" class="w-5 h-5" />
                  <span>{{ isSubmitting ? 'Processing...' : 'Disburse' }}</span>
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
  
  export default defineComponent({
    name: "NewDisbursement",
    components: {
      SideNav,
      Header,
      IconifyIcon,
    },
    data() {
      return {
        form: {
          member_id: "",
          loan_id: "",
          amount: 1500.00,
          status: "pending",
          method: "bank_transfer",
          reference_number: "TRF-2025041501",
          notes: "Initial loan disbursement to member's bank account",
          disbursed_at: null,
          admin_id: "283f95a2-2341-48df-8321-0fd819ebed7c"
        },
        errors: {},
        members: [],
        memberLoans: [],
        selectedLoan: null,
        filteredMembers: [],
        selectedMember: null,
        memberSearchQuery: "",
        showMemberList: false,
        loading: true,
        loadingLoans: false,
        error: null,
        isSubmitting: false,
        alertMessage: "",
        alertType: "",
      };
    },
    computed: {
      loanSelectPlaceholder() {
        if (!this.selectedMember) return "Select a member first";
        if (this.loadingLoans) return "Loading loans...";
        if (this.memberLoans.length === 0) return "No approved loans found for this member";
        return "Select a loan";
      }
    },
    mounted() {
      this.fetchMembers();
      document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
      document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
      formatDisplayDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      },
      
      handleClickOutside(event) {
        const dropdown = this.$el.querySelector('.relative');
        if (dropdown && !dropdown.contains(event.target)) {
          this.showMemberList = false;
        }
      },
      
      async fetchMembers() {
        this.loading = true;
        this.error = null;
        
        try {
          const response = await protectedApi.getMembers();
          this.members = response.data;
          this.filteredMembers = [...this.members];
        } catch (err) {
          console.error("Failed to fetch members:", err);
          this.error = "Failed to load members. Please try again.";
        } finally {
          this.loading = false;
        }
      },
      
      async fetchMemberLoans(memberId) {
        this.loadingLoans = true;
        this.form.loan_id = "";
        this.selectedLoan = null;
        this.memberLoans = [];
        
        try {
          const response = await protectedApi.getMemberLoans(memberId);
          // Filter to only include approved loans that haven't been disbursed
          this.memberLoans = response.data.filter(loan => 
            loan.status === 'approved' && !loan.disbursed_at
          );
        } catch (err) {
          console.error("Failed to fetch member loans:", err);
        } finally {
          this.loadingLoans = false;
        }
      },
      
      filterMembers() {
        if (!this.memberSearchQuery) {
          this.filteredMembers = [...this.members];
          return;
        }
        
        const query = this.memberSearchQuery.toLowerCase();
        this.filteredMembers = this.members.filter(member => {
          const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
          const email = member.email ? member.email.toLowerCase() : '';
          return fullName.includes(query) || email.includes(query);
        });
      },
      
      selectMember(member) {
        this.selectedMember = member;
        this.form.member_id = member.id;
        this.memberSearchQuery = `${member.first_name} ${member.last_name}`;
        this.showMemberList = false;
        this.fetchMemberLoans(member.id);
      },
      
      clearSelectedMember() {
        this.selectedMember = null;
        this.form.member_id = "";
        this.memberSearchQuery = "";
        this.form.loan_id = "";
        this.selectedLoan = null;
        this.memberLoans = [];
      },
      
      async watchLoanSelection() {
        if (!this.form.loan_id) {
          this.selectedLoan = null;
          return;
        }
        
        this.selectedLoan = this.memberLoans.find(loan => loan.id === parseInt(this.form.loan_id));
        
        if (this.selectedLoan) {
          this.form.amount = this.selectedLoan.amount;
        }
      },
      
      validateForm() {
        this.errors = {};
        let isValid = true;
        
        if (!this.form.member_id) {
          this.errors.member_id = "Please select a member";
          isValid = false;
        }
        
        if (!this.form.loan_id) {
          this.errors.loan_id = "Please select a loan";
          isValid = false;
        }
        
        if (!this.form.amount) {
          this.errors.amount = "Amount is required";
          isValid = false;
        } else if (isNaN(this.form.amount) || parseFloat(this.form.amount) <= 0) {
          this.errors.amount = "Please enter a valid amount";
          isValid = false;
        }
        
        if (!this.form.status) {
          this.errors.status = "Status is required";
          isValid = false;
        }
        
        if (!this.form.method) {
          this.errors.method = "Disbursement method is required";
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
          const disbursementData = {
            ...this.form,
            amount: parseFloat(this.form.amount),
            loan_id: parseInt(this.form.loan_id),
            // Set disbursed_at to current time if status is completed
            disbursed_at: this.form.status === 'completed' ? new Date().toISOString() : null
          };
          
          const response = await protectedApi.createDisbursement(disbursementData);
          
          this.alertType = "success";
          this.alertMessage = "Disbursement processed successfully!";
          
          setTimeout(() => {
            this.$router.push({ name: 'disbursements' });
          }, 2000);
        } catch (error) {
          this.alertType = "error";
          if (error.response && error.response.data && error.response.data.error) {
            this.alertMessage = error.response.data.error;
          } else {
            this.alertMessage = "Failed to process disbursement. Please try again.";
          }
          console.error("Error creating disbursement:", error);
        } finally {
          this.isSubmitting = false;
        }
      },
      
      cancel() {
        this.$router.push({ name: 'disbursements' });
      },
    },
    watch: {
      'form.loan_id': function(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.watchLoanSelection();
        }
      }
    }
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
  