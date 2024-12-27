<template>
    <div v-if="loggedIn">
        <div @click="toggleDrawer" :class="[
            'bg-accent p-2 fixed bottom-5 rounded-full w-20 h-20 flex items-center justify-center shadow-lg font-bold cursor-pointer transition-all duration-300',
            isDrawerOpen ? 'right-[19.25rem]' : 'right-5'
        ]">
            <img :src="isDrawerOpen ? getAsset('/cancel.svg') : getAsset('/chat.svg')" alt="icon" class="w-10 h-10" />
        </div>

        <div class="fixed top-0 right-0 h-full w-72 bg-base-100 shadow-lg transform transition-transform z-40 border-l-2 border-orange-700"
            :class="{ 'translate-x-0': isDrawerOpen, 'translate-x-full': !isDrawerOpen }">
            <div class="p-4 flex flex-col h-full text-sm">
                <h2 class="text-lg font-bold mb-2">Chat</h2>

                <div class="flex-1 overflow-y-auto mb-2">
                    <div v-for="(msg, i) in messages" :key="i" class="mb-1 flex items-center">
                        <img :src="getAsset('/twitch.svg')" alt="icon" class="w-4 h-4 mr-1" />
                        <div>
                            <strong :style="`color: ${twitchColors(msg.sender)}`">{{ msg.sender }}:</strong>
                            <span>&nbsp;{{ msg.content }}</span>
                        </div>
                    </div>
                </div>

                <hr class="border-t border-orange-900 my-2" />
                <div class="flex mt-2 flex-col gap-2 items-end">
                    <input v-model="newMessage" placeholder="Escribe un mensaje..."
                        class="w-full text-sm flex-1 border border-gray-300 rounded-sm px-2 py-1"
                        @keyup.enter="onSend" />
                    <button @click="onSend" class="px-2 py-1 bg-accent text-white rounded-sm w-14">
                        Chat
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useChat } from '../composables/useChat';
import { getAsset } from '../core/services/media.service';

// 1) Usar la store de identidad
import { useIdentityStore } from '../stores/identity.store';

// 2) Extraer datos de la store
const id = useIdentityStore();
const { loggedIn, user } = storeToRefs(id);

// 3) Chat composable
const { messages, connect, sendMessage } = useChat();

// 4) Estados locales del componente
const isDrawerOpen = ref(false);
const newMessage = ref('');

// 5) Abrimos la conexión WS solo si el usuario está logueado
onMounted(() => {
    if (loggedIn.value) {
        connect();
    }
});

function toggleDrawer() {
    isDrawerOpen.value = !isDrawerOpen.value;
}

function onSend() {
    if (!newMessage.value.trim()) return;
    sendMessage(newMessage.value);
    newMessage.value = '';
}

const twitchColors = (src: string) => {
    const colors = [
        "#FF7F50", // Coral
        "#1E90FF", // DodgerBlue
        "#00FF7F", // SpringGreen
        "#9ACD32", // YellowGreen
        "#DAA520", // GoldenRod
        "#FF69B4", // HotPink
        "#5F9EA0", // CadetBlue
        "#2E8B57", // SeaGreen
        "#D2691E", // Chocolate
        "#8A2BE2", // BlueViolet
        "#B22222", // Firebrick
    ];

    let hash = 0;
    for (let i = 0; i < src.length; i++) {
        hash = (hash + src.charCodeAt(i)) % colors.length;
    }

    return colors[hash];
};

</script>