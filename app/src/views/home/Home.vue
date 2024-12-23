<template>
    <div class="w-full bg-base-100 rounded-2xl px-3 py-10 shadow-lg">
        <h1 class="text-5xl font-bold text-center">IV Torneo de subs: El Pueblo</h1>
        <h2 class="text-lg font-bold text-center mt-10 mb-2">
            {{ !id.loggedIn ? "Límite de inscripción:" : "El torneo empieza en" }}</h2>
        <Countdown :limit="new Date(2025, 0, 6, 17, 0, 0)" />
        <template v-if="!id.loggedIn">
            <div class="text-lg font-semibold text-center mt-10">
                <p class="font-semibold underline">IMPORTANTE</p>
                <p class="font-light">Para inscribirte necesitas tener previamente cuentas en <a
                        class="text-purple-600 underline" href="https://twitch.tv" target="_blank">Twitch</a> y <a
                        class="text-orange-600 underline" href="https://faceit.com" target="_blank">Faceit</a></p>
            </div>
            <div class="flex flex-col justify-center items-center mt-10">
                <a :href="twitchUrl"><button class="btn btn-lg btn-wide btn-primary text-white">ENTRAR</button></a>
            </div>
        </template>
    </div>
    <div v-if="id.loggedIn"
        class="mt-5 w-full bg-base-100 rounded-2xl p-10 shadow-lg flex flex-row justify-evenly items-center">
        <div class="flex flex-col items-center gap-3">
            <div class="flex flex-row items-center">
                <img src="../../assets/twitch.svg" class="w-6 mr-2" />
                <span class="font-bold">{{ id.user.display_name }}</span>
            </div>
            <div>
                ✅ Suscrito
            </div>
        </div>
        <div class="flex flex-col items-center gap-3">
            <div class="flex flex-row items-center">
                <img src="../../assets/faceit/faceit.svg" class="w-6 mr-2 text-orange-500" />
                <span class="font-bold">{{ id.user.faceit }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
                <img class="w-6" :src="`/src/assets/faceit/lvl${+id.user.faceit_level}.svg`" />
                <img class="w-6" src="../../assets/faceit/elo.svg" />
                <span class="font-bold">{{ +id.user.faceit_elo }}</span>
                <img class="w-6 hover:rotate-180 transition-tran sform duration-500 cursor-pointer"
                    src="../../assets/reload.svg" @click="updateFaceit" />
            </div>
        </div>
    </div>
    <MyTeam v-if="(id.loggedIn && myTeamData)" :data="myTeamData" @reload="load" :key="JSON.stringify(myTeamData)" />
    <Players v-if="playersData" :data="playersData" :key="JSON.stringify(playersData)" @reload="load" />
</template>

<script setup lang="ts">
import Countdown from '../../components/Countdown.vue';
import Players from '../../components/Players.vue';
import MyTeam from '../../components/MyTeam.vue';
import { onBeforeMount, onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import twitchService from '../../core/services/twitch.service';
import faceitService from '../../core/services/faceit.service';
import { useIdentityStore } from '../../stores/identity.store';
import { Couple, Player, PlayersResponse, Request } from '../../core/types';
import dataService from '../../core/services/data.service';

const id = useIdentityStore();

const playersResponse: Ref<PlayersResponse | undefined> = ref();
const myRequests: Ref<Request[] | undefined> = ref();
const myCouple: Ref<Couple | undefined> = ref();
const myTeamData: Ref<{
    allPlayers: Player[];
    myRequests?: Request[];
    myCouple?: Couple;
} | undefined> = ref();
const playersData: Ref<{
    playersResponse: PlayersResponse;
    myRequests?: Request[];
    myCouple?: Couple;
} | undefined> = ref();
const load = async () => {
    playersResponse.value = await dataService.getPlayers();
    myRequests.value = id.loggedIn ? await dataService.getRequests() : undefined;
    myCouple.value = id.loggedIn ? await dataService.getCouple() : undefined;
    myTeamData.value = {
        allPlayers: playersResponse.value.players,
        myRequests: myRequests.value,
        myCouple: myCouple.value
    };
    playersData.value = {
        playersResponse: playersResponse.value,
        myRequests: myRequests.value,
        myCouple: myCouple.value
    }
}

const faceitUpdateDisabled = ref(false);
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

const twitchUrl = ref();
onBeforeMount(async () => {
    twitchUrl.value = await twitchService.getAuthorizeUrl('/');
    await load();
});

let timer: any;
let previous: number;
onMounted(() => {
    timer = setInterval(() => {
        dataService.latestUpdate().then((latest) => {
            if (latest > previous) {
                load();
            }
            previous = latest;
        })
    }, 5000);
})

onBeforeUnmount(() => {
    clearInterval(timer);
})
</script>