<template>
  <div class="min-h-screen relative pb-10">
    <div class="w-md mx-5 md:mx-auto py-10">
      <RouterView />
      <div class="absolute bottom-5 left-0 w-full text-xs mt-5 text-center">made with <span
          class="text-red-500">❤</span> by <a href="https://jgondev.com" class="hover:text-accent hover:underline"
          target="_blank">tronkomovil</a></div>
    </div>
  </div>
  <Chat />
</template>

<script setup lang="ts">
import Chat from './components/Chat.vue';
import { useSSE } from "./composables/useSSE";
import { usePlayersStore } from './stores/players.store';

useSSE();
const players = usePlayersStore();

window.addEventListener('sse-event', () => {
  players.updatePlayers();
})
</script>
