<template>
  <Nav></Nav>
  <div class="min-h-screen">
    <div class="w-md mx-5 md:mx-auto py-10">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Nav from './components/Nav.vue';
</script>