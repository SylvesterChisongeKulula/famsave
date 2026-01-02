<template>
    <div class="min-h-screen bg-gray-100">
        <SideNav>
            <Header>
                <template #title>
                    <h1 class="text-2xl font-medium flex items-center">
                        NEW LOAN
                    </h1>
                </template>
            </Header>

            <!-- Form Container -->
            <div class="p-4">
                <div class="bg-white rounded-lg shadow-sm p-6 mx-auto">
                    <!-- Loading State -->
                    <div
                        v-if="loading"
                        class="flex justify-center items-center p-8"
                    >
                        <IconifyIcon
                            icon="eos-icons:loading"
                            class="w-10 h-10 text-[#ec924b]"
                        />
                        <span class="ml-2 text-gray-600"
                            >Loading members data...</span
                        >
                    </div>

                    <!-- Error State -->
                    <div
                        v-else-if="error"
                        class="p-4 bg-red-100 text-red-800 rounded-md mb-4"
                    >
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
                                <label class="text-sm font-medium text-gray-700"
                                    >Member
                                    <span class="text-red-500">*</span></label
                                >
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
                                        v-if="
                                            showMemberList &&
                                            filteredMembers.length > 0
                                        "
                                        class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                                    >
                                        <div
                                            v-for="member in filteredMembers"
                                            :key="member.id"
                                            @click="selectMember(member)"
                                            class="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <div class="font-medium">
                                                {{ member.first_name }}
                                                {{ member.last_name }}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {{ member.email }}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        v-else-if="
                                            showMemberList &&
                                            memberSearchQuery &&
                                            filteredMembers.length === 0
                                        "
                                        class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2"
                                    >
                                        <p class="text-sm text-gray-500">
                                            No members found
                                        </p>
                                    </div>
                                </div>
                                <div
                                    v-if="selectedMember"
                                    class="mt-2 p-2 bg-gray-50 rounded-md"
                                >
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <div>
                                            <div class="font-medium">
                                                {{ selectedMember.first_name }}
                                                {{ selectedMember.last_name }}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {{ selectedMember.email }}
                                            </div>
                                        </div>
                                        <button
                                            @click="clearSelectedMember"
                                            class="text-gray-500 hover:text-red-500"
                                        >
                                            <IconifyIcon
                                                icon="mdi:close"
                                                class="w-5 h-5"
                                            />
                                        </button>
                                    </div>
                                </div>
                                <span
                                    v-if="errors.member_id"
                                    class="text-red-500 text-xs"
                                    >{{ errors.member_id }}</span
                                >
                            </div>

                            <!-- Due Date Field -->
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-700"
                                    >Due Date
                                    <span class="text-red-500">*</span></label
                                >
                                <input
                                    type="date"
                                    v-model="form.due_date"
                                    class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                                />
                                <span
                                    v-if="errors.due_date"
                                    class="text-red-500 text-xs"
                                    >{{ errors.due_date }}</span
                                >
                            </div>

                            <!-- Status Field -->
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-700"
                                    >Status
                                    <span class="text-red-500">*</span></label
                                >
                                <select
                                    v-model="form.status"
                                    class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="issued">Issued</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <span
                                    v-if="errors.status"
                                    class="text-red-500 text-xs"
                                    >{{ errors.status }}</span
                                >
                            </div>

                            <!-- Amount Field -->
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-gray-700"
                                    >Amount
                                    <span class="text-red-500">*</span></label
                                >
                                <div class="relative">
                                    <span
                                        class="absolute left-3 top-2 text-gray-500"
                                        >K</span
                                    >
                                    <input
                                        type="number"
                                        v-model="form.amount"
                                        placeholder="0.00"
                                        class="p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec924b]"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <span
                                    v-if="errors.amount"
                                    class="text-red-500 text-xs"
                                    >{{ errors.amount }}</span
                                >
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
                                <IconifyIcon
                                    :icon="
                                        isSubmitting
                                            ? 'eos-icons:loading'
                                            : 'material-symbols:add'
                                    "
                                    class="w-5 h-5"
                                />
                                <span>{{
                                    isSubmitting ? "Saving..." : "Save"
                                }}</span>
                            </button>
                        </div>

                        <!-- Success/Error Alert -->
                        <div
                            v-if="alertMessage"
                            class="mt-4 p-3 rounded-md"
                            :class="
                                alertType === 'success'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            "
                        >
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
    name: "NewLoan",
    components: {
        SideNav,
        Header,
        IconifyIcon,
    },
    data() {
        return {
            form: {
                member_id: "",
                amount: null,
                status: "pending", // Default status (lowercase to match API expectations)
                due_date: "", // Will be set in created hook
            },
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
        // Set due date to exactly one month ahead
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        this.form.due_date = this.formatDate(nextMonth);
    },
    mounted() {
        // Fetch members when component is mounted
        this.fetchMembers();

        // Close member dropdown when clicking outside
        document.addEventListener("click", this.handleClickOutside);
    },
    beforeUnmount() {
        // Remove event listener when component is unmounted
        document.removeEventListener("click", this.handleClickOutside);
    },
    methods: {
        // Format date to YYYY-MM-DD
        formatDate(date) {
            return date.toISOString().split("T")[0];
        },

        // Handle click outside member dropdown
        handleClickOutside(event) {
            const dropdown = this.$el.querySelector(".relative");
            if (dropdown && !dropdown.contains(event.target)) {
                this.showMemberList = false;
            }
        },

        // Fetch members from API
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

        // Filter members based on search query
        filterMembers() {
            if (!this.memberSearchQuery) {
                this.filteredMembers = [...this.members];
                return;
            }

            const query = this.memberSearchQuery.toLowerCase();
            this.filteredMembers = this.members.filter((member) => {
                const fullName =
                    `${member.first_name} ${member.last_name}`.toLowerCase();
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
            } else if (
                isNaN(this.form.amount) ||
                parseFloat(this.form.amount) <= 0
            ) {
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

        // Save loan
        async save() {
            if (!this.validateForm()) {
                return;
            }

            this.isSubmitting = true;
            this.alertMessage = "";

            try {
                // Prepare data for submission
                const loanData = {
                    ...this.form,
                    amount: parseFloat(this.form.amount),
                    // Convert date to expected format (ISO format with time)
                    due_date: new Date(this.form.due_date).toISOString(),
                };

                // Add admin ID (in a real app, this would come from your auth state)
                // For now we'll use a placeholder that matches the expected format
                loanData.admin_id = auth.state.userInfo.user_id;

                console.log("DATA !!", auth.state.userInfo);

                const response = await protectedApi.createLoan(loanData);

                this.alertType = "success";
                this.alertMessage = "Loan created successfully!";

                // Reset form after successful submission
                setTimeout(() => {
                    this.$router.push({ name: "loans" });
                }, 2000);
            } catch (error) {
                this.alertType = "error";
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.error
                ) {
                    this.alertMessage = error.response.data.error;
                } else {
                    this.alertMessage =
                        "Failed to create loan. Please try again.";
                }
                console.error("Error creating loan:", error);
            } finally {
                this.isSubmitting = false;
            }
        },

        // Cancel and go back
        cancel() {
            this.$router.push({ name: "loans" });
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

input[type="number"] {
    -moz-appearance: textfield;
}
</style>
