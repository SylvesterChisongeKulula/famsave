<template>
    <div class="min-h-screen bg-gray-100">
      <SideNav>
        <Header>
          <template #title>
            <h1 class="text-2xl font-medium flex items-center">PAYMENTS</h1>
          </template>
        </Header>
  
        <div
          class="p-4 flex flex-row items-center justify-between gap-4 bg-gray-100"
        >
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-md">
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <IconifyIcon
                  icon="heroicons-outline:search"
                  class="w-4 h-4 text-gray-400"
                />
              </div>
              <input
                type="text"
                placeholder="Search"
                v-model="searchQuery"
                class="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ec924b] text-sm font-poppins"
              />
            </div>
          </div>
  
          <!-- Date Filter and Add Payment Button Container -->
          <div class="flex items-center gap-2">
            <!-- Date Filter -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700"
                >Filter by Month:</label
              >
              <input
                type="month"
                v-model="selectedMonth"
                class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
              />
            </div>
  
            <!-- Add Payment Button -->
            <button
              class="bg-[#f8d7b0] hover:bg-[#ec924b] transition-colors duration-200 rounded px-4 py-2 flex items-center gap-2"
              @click="navigateToNewPayment"
            >
              <IconifyIcon
                icon="material-symbols:add"
                class="w-5 h-5 text-[#12290a]"
              />
              <span class="text-[#12290a] font-poppins text-sm">Add Payment</span>
            </button>
          </div>
        </div>
  
        <!-- Loading Indicator -->
        <div v-if="loading" class="p-4 text-center">
          <p class="text-gray-600">Loading payments...</p>
        </div>
  
        <!-- Error Message -->
        <div v-else-if="error" class="p-4 text-center">
          <p class="text-red-600">{{ error }}</p>
          <button @click="fetchPayments" class="mt-2 text-[#ec924b] hover:underline">
            Retry
          </button>
        </div>
  
        <!-- Table Component -->
        <div v-else class="p-4">
          <ReusableTable
            :headers="headers"
            :rows="formattedPayments"
            :totalRows="totalPayments"
            :linesPerPage="linesPerPage"
            @edit="handleEdit"
            @delete="handleDelete"
            @page-change="handlePageChange"
            @lines-per-page-change="handleLinesPerPageChange"
          />
        </div>
      </SideNav>
  
      <!-- Confirmation Dialog -->
      <ConfirmDialog
        :show="showDeleteDialog"
        title="Delete Payment"
        message="Are you sure you want to delete this payment? This action cannot be undone."
        confirmButtonText="Delete"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />
  
      <!-- Success Toast Notification -->
      <div 
        v-if="notification.show" 
        class="fixed bottom-4 right-4 p-4 rounded-md shadow-lg max-w-sm"
        :class="notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
      >
        <div class="flex items-center">
          <IconifyIcon 
            :icon="notification.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" 
            class="w-5 h-5 mr-2" 
          />
          {{ notification.message }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import SideNav from "../components/SideNav.vue";
  import Header from "../components/Header.vue";
  import { Icon as IconifyIcon } from "@iconify/vue";
  import ReusableTable from "../components/Table.vue";
  import ConfirmDialog from "../components/ConfirmDialog.vue";
  import { protectedApi } from "../api"; // Make sure this path is correct
  
  export default defineComponent({
    name: "Payments",
    components: {
      SideNav,
      Header,
      IconifyIcon,
      ReusableTable,
      ConfirmDialog,
    },
    data() {
      return {
        selectedMonth: "", // For date filter
        headers: [
          "ID",
          "Amount",
          "Status",
          "Date",
          "Member",
          "Loan ID",
          "Loan Amount",
          "Loan Status",
          "Actions",
        ],
        payments: [],
        loading: true,
        error: null,
        searchQuery: "",
        linesPerPage: 5,
        currentPage: 1,
        totalPayments: 0,
        // For delete confirmation
        showDeleteDialog: false,
        paymentToDelete: null,
        // For notification toast
        notification: {
          show: false,
          type: 'success', // or 'error'
          message: '',
          timeout: null
        }
      };
    },
    computed: {
      // Format the payments data for the table
      formattedPayments() {
        if (!this.payments.length) return [];
        
        // Filter payments based on search query and selected month
        return this.payments
          .filter(payment => {
            // Search filter
            if (this.searchQuery) {
              const paymentId = String(payment.id);
              const amount = String(payment.amount);
              const status = payment.status.toLowerCase();
              const searchLower = this.searchQuery.toLowerCase();
              
              // Include member name in search
              let memberName = '';
              if (payment.member) {
                memberName = `${payment.member.first_name} ${payment.member.last_name}`.toLowerCase();
              }
              
              if (!paymentId.includes(searchLower) && 
                  !amount.includes(searchLower) && 
                  !status.includes(searchLower) &&
                  !memberName.includes(searchLower)) {
                return false;
              }
            }
            
            // Month filter
            if (this.selectedMonth) {
              const createdDate = new Date(payment.created_at);
              const [filterYear, filterMonth] = this.selectedMonth.split('-');
              
              if (createdDate.getFullYear() !== parseInt(filterYear) || 
                  createdDate.getMonth() + 1 !== parseInt(filterMonth)) {
                return false;
              }
            }
            
            return true;
          })
          .map(payment => {
            // Format date
            const createdDate = new Date(payment.created_at);
            const formattedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;
            
            // Format member name
            const memberName = payment.member ? 
              `${payment.member.first_name} ${payment.member.last_name}` : 
              'N/A';
              
            return [
              String(payment.id),
              `K${payment.amount.toFixed(2)}`,
              payment.status.toUpperCase(),
              formattedDate,
              memberName,
              payment.loan ? String(payment.loan.id) : 'N/A',
              payment.loan ? `K${payment.loan.amount.toFixed(2)}` : 'N/A',
              payment.loan ? payment.loan.status.toUpperCase() : 'N/A'
            ];
          });
      }
    },
    methods: {
      // Fetch payments from the API
      async fetchPayments() {
        this.loading = true;
        this.error = null;
        
        try {
          const response = await protectedApi.getPayments();
          this.payments = response.data;
          this.totalPayments = this.payments.length;
        } catch (err) {
          console.error("Failed to fetch payments:", err);
          this.error = "Failed to load payments. Please try again.";
        } finally {
          this.loading = false;
        }
      },
      
      // Handle edit action
      handleEdit(rowData) {
        // Get the payment ID (first element in the row)
        const paymentId = rowData[0];
        // Navigate to update-payment page with ID parameter
        this.$router.push(`/update-payment/${paymentId}`);
      },
      
      // Handle delete action - show confirmation dialog
      handleDelete(rowData) {
        // Get the payment ID (first element in the row)
        this.paymentToDelete = rowData[0];
        this.showDeleteDialog = true;
      },
      
      // Cancel delete action
      cancelDelete() {
        this.showDeleteDialog = false;
        this.paymentToDelete = null;
      },
      
      // Confirm delete action
      confirmDelete() {
        if (this.paymentToDelete) {
          this.deletePayment(this.paymentToDelete);
        }
        this.showDeleteDialog = false;
      },
      
      // Delete payment API call
      async deletePayment(id) {
        try {
          await protectedApi.deletePayment(id);
          
          // Remove from local state
          this.payments = this.payments.filter(payment => payment.id !== parseInt(id));
          this.totalPayments = this.payments.length;
          
          // Show success notification
          this.showNotification('success', 'Payment deleted successfully');
        } catch (err) {
          console.error("Failed to delete payment:", err);
          this.showNotification('error', 'Failed to delete payment. Please try again.');
        }
      },
      
      // Navigate to add payment page
      navigateToNewPayment() {
        this.$router.push("/add-payment");
      },
      
      // Handle pagination
      handlePageChange(page) {
        this.currentPage = page;
        // If you have pagination on the backend:
        // this.fetchPayments(page, this.linesPerPage);
      },
      
      // Handle lines per page change
      handleLinesPerPageChange(lines) {
        this.linesPerPage = lines;
        this.currentPage = 1; // Reset to first page
        // If you have pagination on the backend:
        // this.fetchPayments(1, lines);
      },
      
      // Show notification toast
      showNotification(type, message) {
        // Clear any existing timeout
        if (this.notification.timeout) {
          clearTimeout(this.notification.timeout);
        }
        
        // Set notification
        this.notification = {
          show: true,
          type,
          message,
          timeout: setTimeout(() => {
            this.notification.show = false;
          }, 3000) // Hide after 3 seconds
        };
      }
    },
    // Fetch payments when component is mounted
    mounted() {
      this.fetchPayments();
    },
    // Clear any notification timeout when component is unmounted
    beforeUnmount() {
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout);
      }
    }
  });
  </script>
  
  <style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
  
  .font-poppins {
    font-family: "Poppins", sans-serif;
  }
  </style>
