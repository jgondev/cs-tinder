<template>
    <div class="navbar bg-base-100">
        <div class="flex-1">
            <a href="/">
                <img src="../assets/logo.jpg" class="max-h-10 ml-2" />
            </a>
            <a href="https://www.twitch.tv/the_real_fer" target="_blank"
                class="btn btn-ghost normal-case text-xl">the_real_fer</a>
        </div>
        <div class="flex-none">
            <div v-if="state.loggedIn" class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                    <div class="w-10 rounded-full">
                        <img :src="state.id.user.profile_image_url" />
                    </div>
                </label>
                <ul tabindex="0"
                    class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a @click="logout">Logout</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import twitchService from "../core/services/twitch.service";
import { useIdentityStore } from "../stores/identity.store";

const state = useIdentityStore();

const twitchUrl = ref();
onBeforeMount(async () => {
    twitchUrl.value = await twitchService.getAuthorizeUrl('/');
})

const logout = () => {
    localStorage.clear();
    window.location.href = '/';
}
</script>