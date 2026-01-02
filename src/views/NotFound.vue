<template>
    <div class="not-found-page bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      <div class="text-center max-w-md">
        <h1 class="text-6xl font-bold text-[#ec924b] mb-4">404</h1>
        <h2 class="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
        <p class="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <router-link
          to="/dashboard"
          class="bg-[#ec924b] hover:bg-[#e0803a] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
        >
          Go Back Home
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundPage'
  }
  </script>
  
  <style scoped>
  /* You can add custom styles here if needed */
  </style>