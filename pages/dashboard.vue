<script setup>
  definePageMeta({
    middleware: ["auth"],
  });
</script>

<template>
  <Sidebar />
  <div class="p-10 md:ml-72"></div>
</template>