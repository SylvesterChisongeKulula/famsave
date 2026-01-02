<template>
  <div class="bg-white rounded-sm">
    <table class="w-full">
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="text-left p-5 text-xs font-normal text-black"
            :class="{ 'text-right': header === 'Actions' }"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in paginatedRows"
          :key="index"
          class="border-t border-gray-100 hover:bg-gray-50"
        >
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="p-5 text-xs"
          >
            {{ cell }}
          </td>
          <td class="p-5 text-xs text-right">
            <div class="flex justify-end gap-2.5">
              <button
                @click="handleEdit(row)"
                class="hover:bg-green-50 p-1 rounded-sm transition-colors"
                title="Edit Member"
              >
                <IconifyIcon
                  icon="mdi:pencil"
                  class="w-[18px] h-[18px] text-[#9ee076]"
                />
              </button>
              <button
                @click="handleDelete(row)"
                class="hover:bg-green-50 p-1 rounded-sm transition-colors"
                title="Delete Member"
              >
                <IconifyIcon
                  icon="mdi:trash"
                  class="w-[18px] h-[18px] text-[#9ee076]"
                />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td :colspan="headers.length + 1" class="p-5 text-center text-gray-500 text-xs">
            No data available
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination and Filters -->
    <div
      class="p-4 flex flex-row items-center justify-between border-t border-gray-100"
    >
      <!-- Total Rows -->
      <div class="text-xs text-gray-600">Total {{ totalRows }} rows</div>

      <!-- Pagination -->
      <div class="flex items-center gap-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-1 text-xs text-gray-600 hover:bg-gray-100 rounded-sm transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          &lt; Previous
        </button>
        <span class="text-xs text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="p-1 text-xs text-gray-600 hover:bg-gray-100 rounded-sm transition-colors"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          Next &gt;
        </button>
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-600">Show:</span>
        <select
          v-model="itemsPerPage"
          @change="updateLinesPerPage"
          class="p-1 text-xs text-gray-600 border border-gray-200 rounded-sm"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Icon as IconifyIcon } from "@iconify/vue";

export default defineComponent({
  name: "ReusableTable",
  components: {
    IconifyIcon,
  },
  props: {
    headers: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    totalRows: {
      type: Number,
      default() {
        return this.rows.length;
      }
    },
    linesPerPage: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalRows / this.itemsPerPage) || 1;
    },
    paginatedRows() {
      // If the parent component handles pagination, use all rows
      if (this.rows.length <= this.itemsPerPage) {
        return this.rows;
      }
      
      // Otherwise, paginate the rows client-side
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.rows.slice(start, end);
    }
  },
  watch: {
    linesPerPage: {
      immediate: true,
      handler(newVal) {
        this.itemsPerPage = Number(newVal);
      }
    }
  },
  methods: {
    // Pass the entire row data to parent when edit button is clicked
    handleEdit(row) {
      this.$emit("edit", row);
    },
    
    // Pass the entire row data to parent when delete button is clicked
    handleDelete(row) {
      this.$emit("delete", row);
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.$emit("page-change", page);
      }
    },
    
    updateLinesPerPage() {
      this.currentPage = 1; // Reset to first page
      this.$emit("lines-per-page-change", this.itemsPerPage);
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

.font-poppins {
  font-family: "Poppins", sans-serif;
}
</style>