<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Added bg-gray-100 for gray background -->
    <SideNav>
      <Header>
        <template #title>
          <h1 class="text-2xl font-medium flex items-center">MEMBERS</h1>
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
        <!-- Add Member Button -->
        <button
          class="bg-[#f8d7b0] hover:bg-[#ec924b] transition-colors duration-200 rounded px-4 py-2 flex items-center gap-2"
          @click="navigateToNewMember"
        >
          <IconifyIcon
            icon="material-symbols:add"
            class="w-5 h-5 text-[#12290a]"
          />
          <span class="text-[#12290a] font-poppins text-sm">Add Member</span>
        </button>
      </div>
      <!-- Loading Indicator -->
      <div v-if="loading" class="p-4 text-center">
        <p class="text-gray-600">Loading members...</p>
      </div>
      <!-- Error Message -->
      <div v-else-if="error" class="p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchMembers" class="mt-2 text-[#ec924b] hover:underline">
          Retry
        </button>
      </div>
      <!-- Table Component -->
      <div v-else class="p-4">
        <ReusableTable
          :headers="headers"
          :rows="formattedMembers"
          :totalRows="totalMembers"
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
      title="Delete Member"
      message="Are you sure you want to delete this member? This action cannot be undone."
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
import { protectedApi } from "../api"; // Make sure the path is correct
export default defineComponent({
  name: "Members",
  components: {
    SideNav,
    Header,
    IconifyIcon,
    ReusableTable,
    ConfirmDialog,
  },
  data() {
    return {
      headers: [
        "ID",
        "Name",
        "Phone",
        "Interest",
        "Net Value",
        "Pending Loan",
        "Status",
        "Actions"
      ],
      members: [],
      loading: true,
      error: null,
      searchQuery: "",
      linesPerPage: 5,
      currentPage: 1,
      totalMembers: 0,
      // For delete confirmation
      showDeleteDialog: false,
      memberToDelete: null,
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
    // Format the members data for the table
    formattedMembers() {
      if (!this.members.length) return [];
      
      return this.members
        .filter(member => {
          if (!this.searchQuery) return true;
          const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
          const searchLower = this.searchQuery.toLowerCase();
          return fullName.includes(searchLower) || 
                 member.phone?.includes(this.searchQuery) ||
                 member.email?.toLowerCase().includes(searchLower) ||
                 member.id?.includes(this.searchQuery);
        })
        .map(member => {
          // Calculate the total interest amount
          let totalInterestAmount = 0;
          const hasApprovedLoans = member.approved_loans !== null && Array.isArray(member.approved_loans);
          
          if (hasApprovedLoans) {
            member.approved_loans.forEach(loan => {
              // Calculate interest amount: loan.amount * (loan.interest / 100)
              const interestAmount = loan.amount * (loan.interest / 100);
              totalInterestAmount += interestAmount;
            });
          }
          
          // Determine pending loan status
          const hasPendingLoan = hasApprovedLoans;
          
          return [
            member.id.substring(0, 8), // First 8 characters of UUID
            `${member.first_name} ${member.last_name}`,
            member.phone || 'N/A',
            `K${totalInterestAmount.toFixed(2)}`,
            `K${member.net_value.toFixed(2)}`,
            hasPendingLoan ? 'YES' : 'NO',
            member.status.toUpperCase()
          ];
        });
    }
  },
  methods: {
    // Fetch members from the API
    async fetchMembers() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await protectedApi.getMembers();
        this.members = response.data;
        this.totalMembers = this.members.length;
      } catch (err) {
        console.error("Failed to fetch members:", err);
        this.error = "Failed to load members. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    
    // Handle edit action
    handleEdit(rowData) {
      // Get the member ID (first element in the row)
      const memberId = rowData[0];
      
      // Find the full member ID from the shortened display version
      const member = this.members.find(m => m.id.startsWith(memberId));
      if (member) {
        // Navigate to update-member page with ID parameter
        this.$router.push(`/update-member/${member.id}`);
      }
    },
    
    // Handle delete action - show confirmation dialog
    handleDelete(rowData) {
      // Get the member ID (first element in the row)
      const memberId = rowData[0];
      
      // Find the full member ID from the shortened display version
      const member = this.members.find(m => m.id.startsWith(memberId));
      if (member) {
        this.memberToDelete = member.id;
        this.showDeleteDialog = true;
      }
    },
    
    // Cancel delete action
    cancelDelete() {
      this.showDeleteDialog = false;
      this.memberToDelete = null;
    },
    
    // Confirm delete action
    confirmDelete() {
      if (this.memberToDelete) {
        this.deleteMember(this.memberToDelete);
      }
      this.showDeleteDialog = false;
    },
    
    // Delete member API call
    async deleteMember(id) {
      try {
        await protectedApi.deleteMember(id);
        
        // Remove from local state
        this.members = this.members.filter(member => member.id !== id);
        this.totalMembers = this.members.length;
        
        // Show success notification
        this.showNotification('success', 'Member deleted successfully');
      } catch (err) {
        console.error("Failed to delete member:", err);
        this.showNotification('error', 'Failed to delete member. Please try again.');
      }
    },
    
    // Navigate to add member page
    navigateToNewMember() {
      this.$router.push("/new-member");
    },
    
    // Handle pagination
    handlePageChange(page) {
      this.currentPage = page;
      // If you have pagination on the backend:
      // this.fetchMembers(page, this.linesPerPage);
    },
    
    // Handle lines per page change
    handleLinesPerPageChange(lines) {
      this.linesPerPage = lines;
      this.currentPage = 1; // Reset to first page
      // If you have pagination on the backend:
      // this.fetchMembers(1, lines);
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
  // Fetch members when component is mounted
  mounted() {
    this.fetchMembers();
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