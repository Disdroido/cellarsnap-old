<script setup>
  const user = useSupabaseUser();
  // watchEffect(() => {
  //   if (!user.value) {
  //     return navigateTo('/login');
  //   }
  // });
  // definePageMeta({
  //   middleware: 'auth',
  // });
</script>

<template>
  <TopNavIndex />
</template>