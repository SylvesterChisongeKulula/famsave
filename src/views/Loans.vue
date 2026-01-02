<template>
  <div class="min-h-screen bg-gray-100">
    <SideNav>
      <Header>
        <template #title>
          <h1 class="text-2xl font-medium flex items-center">LOANS</h1>
        </template>
      </Header>

      <div
        class="p-4 flex flex-row items-center justify-between gap-4 bg-[#e4e4e4]"
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

        <!-- Date Filter and Add Loan Button Container -->
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

          <!-- Add Loan Button -->
          <button
            class="bg-[#f8d7b0] hover:bg-[#ec924b] transition-colors duration-200 rounded px-4 py-2 flex items-center gap-2"
            @click="navigateToNewLoan"
          >
            <IconifyIcon
              icon="material-symbols:add"
              class="w-5 h-5 text-[#12290a]"
            />
            <span class="text-[#12290a] font-poppins text-sm">Add Loan</span>
          </button>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="p-4 text-center">
        <p class="text-gray-600">Loading loans...</p>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchLoans" class="mt-2 text-[#ec924b] hover:underline">
          Retry
        </button>
      </div>

      <!-- Table Component -->
      <div v-else class="p-4">
        <ReusableTable
          :headers="headers"
          :rows="formattedLoans"
          :totalRows="totalLoans"
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
      title="Delete Loan"
      message="Are you sure you want to delete this loan? This action cannot be undone."
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
  name: "Loans",
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
        "Interest Rate",
        "Amount Due",
        "Balance",
        "Due Date",
        "Member",
        "Status",
        "Actions",
      ],
      loans: [],
      loading: true,
      error: null,
      searchQuery: "",
      linesPerPage: 5,
      currentPage: 1,
      totalLoans: 0,
      // For delete confirmation
      showDeleteDialog: false,
      loanToDelete: null,
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
    // Format the loans data for the table
    formattedLoans() {
      if (!this.loans.length) return [];
      
      // Filter loans based on search query and selected month
      return this.loans
        .filter(loan => {
          // Search filter
          if (this.searchQuery) {
            const loanId = String(loan.id);
            const amount = String(loan.amount);
            const status = loan.status.toLowerCase();
            const searchLower = this.searchQuery.toLowerCase();
            
            // Include member name in search
            let memberName = '';
            if (loan.member) {
              memberName = `${loan.member.first_name} ${loan.member.last_name}`.toLowerCase();
            }
            
            if (!loanId.includes(searchLower) && 
                !amount.includes(searchLower) && 
                !status.includes(searchLower) &&
                !memberName.includes(searchLower)) {
              return false;
            }
          }
          
          // Month filter
          if (this.selectedMonth) {
            const dueDate = new Date(loan.due_date);
            const [filterYear, filterMonth] = this.selectedMonth.split('-');
            
            if (dueDate.getFullYear() !== parseInt(filterYear) || 
                dueDate.getMonth() + 1 !== parseInt(filterMonth)) {
              return false;
            }
          }
          
          return true;
        })
        .map(loan => {
          // Format date
          const dueDate = new Date(loan.due_date);
          const formattedDueDate = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;
          
          // Format member name
          const memberName = loan.member ? 
            `${loan.member.first_name} ${loan.member.last_name}` : 
            'N/A';
            
          return [
            String(loan.id),
            `K${loan.amount.toFixed(2)}`,
            `${loan.interest}%`,
            `K${loan.amount_due.toFixed(2)}`,
            `K${loan.balance.toFixed(2)}`,
            formattedDueDate,
            memberName,
            loan.status.toUpperCase()
          ];
        });
    }
  },
  methods: {
    // Fetch loans from the API
    async fetchLoans() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await protectedApi.getLoans();
        this.loans = response.data;
        this.totalLoans = this.loans.length;
      } catch (err) {
        console.error("Failed to fetch loans:", err);
        this.error = "Failed to load loans. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    
    // Handle edit action
    handleEdit(rowData) {
      // Get the loan ID (first element in the row)
      const loanId = rowData[0];
      // Navigate to update-loan page with ID parameter
      this.$router.push(`/update-loan/${loanId}`);
    },
    
    // Handle delete action - show confirmation dialog
    handleDelete(rowData) {
      // Get the loan ID (first element in the row)
      this.loanToDelete = rowData[0];
      this.showDeleteDialog = true;
    },
    
    // Cancel delete action
    cancelDelete() {
      this.showDeleteDialog = false;
      this.loanToDelete = null;
    },
    
    // Confirm delete action
    confirmDelete() {
      if (this.loanToDelete) {
        this.deleteLoan(this.loanToDelete);
      }
      this.showDeleteDialog = false;
    },
    
    // Delete loan API call
    async deleteLoan(id) {
      try {
        await protectedApi.deleteLoan(id);
        
        // Remove from local state
        this.loans = this.loans.filter(loan => loan.id !== parseInt(id));
        this.totalLoans = this.loans.length;
        
        // Show success notification
        this.showNotification('success', 'Loan deleted successfully');
      } catch (err) {
        console.error("Failed to delete loan:", err);
        this.showNotification('error', 'Failed to delete loan. Please try again.');
      }
    },
    
    // Navigate to add loan page
    navigateToNewLoan() {
      this.$router.push("/new-loan");
    },
    
    // Handle pagination
    handlePageChange(page) {
      this.currentPage = page;
      // If you have pagination on the backend:
      // this.fetchLoans(page, this.linesPerPage);
    },
    
    // Handle lines per page change
    handleLinesPerPageChange(lines) {
      this.linesPerPage = lines;
      this.currentPage = 1; // Reset to first page
      // If you have pagination on the backend:
      // this.fetchLoans(1, lines);
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
  // Fetch loans when component is mounted
  mounted() {
    this.fetchLoans();
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
