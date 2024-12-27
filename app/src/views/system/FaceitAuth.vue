<template></template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import faceitService from '../../core/services/faceit.service';
import { useIdentityStore } from '../../stores/identity.store';
import { usePlayersStore } from '../../stores/players.store';

const route = useRoute();
const router = useRouter();
const identity = useIdentityStore();
const players = usePlayersStore();

onBeforeMount(async () => {
    try {
        const code = route.query.code?.toString();
        if (code) {
            const codeVerifier = localStorage.getItem('faceit_code_verifier');
            if (!codeVerifier) {
                throw new Error('Code verifier is missing');
            }

            const id = await faceitService.link(code, codeVerifier);
            identity.setId(id);
            await players.updatePlayers();

            router.push({ name: 'home' });
        }
    } catch (error) {
        console.error('Error during Faceit login:', error);
    }
});
</script>
