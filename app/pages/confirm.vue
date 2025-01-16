<template>
  <UCard>
    <template #header>
      Signin in...
    </template>

    Wait a moment while we sign you in...
  </UCard>
</template>

<script setup>
useRedirectIfAuthenticated()
</script>