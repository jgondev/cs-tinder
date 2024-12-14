<template></template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dataService from '../../core/services/data.service';
import twitchService from '../../core/services/twitch.service';
import { useIdentityStore } from '../../stores/identity.store';

const route = useRoute();
const router = useRouter();

const identity = useIdentityStore();

onBeforeMount(async () => {
    if (route.query.code) {
        await twitchService.login(route.query.code.toString())
            .then(async (id) => {
                if (id) {
                    identity.setId(id);
                }
                else {
                    alert('Para participar hay que ser sub del canal')
                }
                
                router.push({ name: 'home' })
            });
    }
})

</script>