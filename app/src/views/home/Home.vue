<template>
    <div class="w-full bg-base-100 px-3 py-10 shadow-lg">
        <h1 class="font-bold text-center">
            <span class="text-4xl">IV Torneo CS2</span>
            <br />
            <span
                class="text-5xl lg:text-7xl leading-relaxed bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
                El Pueblo
            </span>
        </h1>
        <h2 class="text-lg font-bold text-center mt-10 mb-2">
            {{ !id.loggedIn ? "Límite de inscripción:" : "El torneo empieza en" }}
        </h2>
        <Countdown :limit="new Date(2025, 0, 6, 17, 0, 0)" />
        <template v-if="!id.loggedIn">
            <div class="text-lg font-semibold text-center mt-10">
                <p class="font-semibold underline">IMPORTANTE</p>
                <p class="font-light">
                    Para inscribirte necesitas tener previamente cuentas en
                    <a class="text-purple-600 text-base font-bold" href="https://twitch.tv" target="_blank">Twitch</a>
                    y
                    <a class="text-orange-600 text-base font-bold" href="https://faceit.com" target="_blank">Faceit</a>
                </p>
            </div>
            <div class="flex flex-col justify-center items-center mt-10">
                <a :href="twitchUrl"><button class="btn btn-lg btn-wide btn-accent text-white">
                        ENTRAR
                    </button></a>
            </div>
        </template>
    </div>
    <div>
        <div v-if="id.loggedIn"
            class="relative col-span-10 mt-5 w-full bg-base-100 p-10 shadow-lg flex flex-row justify-evenly items-center">
            <div class="flex flex-col items-center gap-3">
                <div class="flex flex-row items-center">
                    <img src="../../assets/twitch.svg" class="w-6 mr-2" />
                    <span class="font-bold">{{ id.user.display_name }}</span>
                </div>
                <div>✅ Suscrito</div>
            </div>
            <div class="flex flex-col items-center gap-3">
                <div class="flex flex-row items-center">
                    <img src="../../assets/faceit/faceit.svg" class="w-6 mr-2" />
                    <span class="font-bold">{{ id.user.faceit }}</span>
                </div>
                <div class="flex flex-row items-center gap-2">
                    <img class="w-6" :src="getLevelImage(+id.user.faceit_level)" />
                    <img class="w-6" src="../../assets/faceit/elo.svg" />
                    <span class="font-bold">{{ +id.user.faceit_elo }}</span>
                    <img class="w-6 hover:rotate-180 transition-transform duration-500 cursor-pointer"
                        src="../../assets/reload.svg" @click="updateFaceit" />
                </div>
            </div>
            <div class="tooltip tooltip-top absolute top-0 right-0" data-tip="Retirarme del torneo">
                <button class="btn btn-sm btn-accent" @click="gg">GG</button>
            </div>
        </div>
    </div>

    <MyTeam v-if="id.loggedIn && myTeamData" :data="myTeamData" @reload="load" :key="JSON.stringify(myTeamData)" />
    <Players v-if="playersStore.players && playersStore.players.players" :data="{
        players: playersStore.players.players,
        couples: playersStore.players.couples,
        myRequests: myRequests,
        myCouple: myCouple
    }" @reload="load" />

    <Chat />
</template>

<script setup lang="ts">
import Countdown from '../../components/Countdown.vue';
import Players from '../../components/Players.vue';
import MyTeam from '../../components/MyTeam.vue';
import Chat from '../../components/Chat.vue';
import { onBeforeMount, ref } from 'vue';

import twitchService from '../../core/services/twitch.service';
import faceitService from '../../core/services/faceit.service';
import dataService from '../../core/services/data.service';
import { getLevelImage } from '../../core/services/media.service';

import { useIdentityStore } from '../../stores/identity.store';
import { usePlayersStore } from '../../stores/players.store';

import type { Couple, Player, Request } from '../../core/types';

const id = useIdentityStore();
const playersStore = usePlayersStore();

const myRequests = ref<Request[] | undefined>();
const myCouple = ref<Couple | undefined>();

const myTeamData = ref<{
    allPlayers: Player[];
    myRequests?: Request[];
    myCouple?: Couple;
} | undefined>();

const faceitUpdateDisabled = ref(false);

const load = async () => {
    myRequests.value = id.loggedIn ? await dataService.getRequests() : undefined;
    myCouple.value = id.loggedIn ? await dataService.getCouple() : undefined;
    if (playersStore.players) {
        myTeamData.value = {
            allPlayers: playersStore.players.players,
            myRequests: myRequests.value,
            myCouple: myCouple.value,
        };
    }
};

const updateFaceit = async () => {
    if (faceitUpdateDisabled.value) return;
    handleFaceitUpdateButton();
    try {
        const user = await faceitService.update();
        id.updateUser(user);
    } catch (error) {
        console.error('Error al actualizar Faceit:', error);
    }
};

const handleFaceitUpdateButton = () => {
    faceitUpdateDisabled.value = true;
    setTimeout(() => {
        faceitUpdateDisabled.value = false;
    }, 10000);
};

const gg = async () => {
    await dataService.gg();
    localStorage.clear();
    window.location.href = '/';
};

const twitchUrl = ref<string>();
onBeforeMount(async () => {
    twitchUrl.value = await twitchService.getAuthorizeUrl('/');
    window.addEventListener('sse-event', load);
    load();
});
</script>