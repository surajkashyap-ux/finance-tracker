<template>
  <div class="max-w-screen-lg mx-auto p-4 md:p-6 lg:p-8">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div class="lg:col-span-2 bg-gray-100 rounded-lg shadow-md p-4 h-96">
        <UVerticalNavigation :links="links" />
      </div>
      
      <div class="lg:col-span-4 bg-white rounded-lg shadow-md p-4 h-96 overflow-y-auto">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>


<script setup>
  const links = [
    { label: 'Back to home', to: '/' },
    { label: 'Profile', to: '/settings/profile' },
    { label: 'Avatar', to: '/settings/avatar' },
    { label: 'Settings', to: '/settings/settings' },
  ];
</script>