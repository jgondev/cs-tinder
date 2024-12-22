<template></template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import twitchService from '../../core/services/twitch.service';
import { useIdentityStore } from '../../stores/identity.store';

const route = useRoute();
const router = useRouter();

const identity = useIdentityStore();

onBeforeMount(async () => {
    try {
        if (route.query.code) {
            const id = await twitchService.login(route.query.code.toString());

            if (id) {
                identity.setId(id);
                if (id.user?.faceit) {
                    router.push({ name: 'home' });
                }
                else {
                    router.push({ name: 'faceit' });
                }
            } else {
                alert('Para participar hay que ser sub del canal');
            }
        }
    } catch (error) {
        console.error('Error during Twitch login:', error);
    }
});


</script>