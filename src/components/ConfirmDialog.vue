<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-40" @click="cancel"></div>
      
      <!-- Dialog -->
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 z-10 shadow-xl">
        <h3 class="text-lg font-medium mb-3 text-gray-800">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancel"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirm"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "ConfirmDialog",
    props: {
      show: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: "Confirm Action"
      },
      message: {
        type: String,
        default: "Are you sure you want to proceed?"
      },
      confirmButtonText: {
        type: String,
        default: "Confirm"
      }
    },
    methods: {
      cancel() {
        this.$emit("cancel");
      },
      confirm() {
        this.$emit("confirm");
      }
    }
  });
  </script>