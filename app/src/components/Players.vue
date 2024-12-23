<template>
    <div v-if="(players.length > 0)" class="mt-5 w-full bg-base-100 px-3 sm:px-10 py-10 shadow-lg"
        :class="lock ? 'pointer-events-none opacity-50' : ''">
        <h1 class="text-3xl font-bold text-center mb-10">Inscritos</h1>
        <div class="grid gap-4 grid-cols-4">
            <div v-for="couple in couples"
                class="relative col-span-4 lg:col-span-2 p-3 shadow border-orange-900 hover:border-orange-700 rounded-sm border-2 border-solid flex flex-row justify-evenly">
                <div class="player">
                    <div class="player-name flex flex-row justify-center font-semibold mb-3">
                        <img src="../assets/twitch.svg" class="w-3 mr-1" />
                        <span>{{ getPlayerById(couple.player1)!.name }}</span>
                    </div>
                    <div class="flex items-center justify-center gap-1 mb-3">
                        <img class="w-6" :src="`/src/assets/faceit/lvl${+getPlayerById(couple.player1)!.level}.svg`" />
                        <img class="w-6" src="../assets/faceit/elo.svg" />
                        <span class="font-semibold">{{ +getPlayerById(couple.player1)!.elo }}</span>
                    </div>
                    <div class="avatar max-w-[10rem]">
                        <div class="mask mask-circle">
                            <img :src="getPlayerById(couple.player1)!.image" />
                        </div>
                    </div>
                </div>
                <img src="../assets/knives.svg" class="absolute w-8 -ml-4 left-1/2 top-1/3" />
                <div class="player">
                    <div class="player-name flex flex-row justify-center font-semibold mb-3">
                        <img src="../assets/twitch.svg" class="w-3 mr-1" />
                        <span>{{ getPlayerById(couple.player2)!.name }}</span>
                    </div>
                    <div class="flex items-center justify-center gap-1 mb-3">
                        <img class="w-6" :src="`/src/assets/faceit/lvl${+getPlayerById(couple.player1)!.level}.svg`" />
                        <img class="w-6" src="../assets/faceit/elo.svg" />
                        <span class="font-semibold">{{ +getPlayerById(couple.player1)!.elo }}</span>
                    </div>
                    <div class="avatar max-w-[10rem]">
                        <div class="mask mask-circle">
                            <img :src="getPlayerById(couple.player2)!.image" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="player in singlePlayers"
                class="relative col-span-2 lg:col-span-1 p-5 shadow border-orange-900 hover:border-orange-700 border-2 border-solid flex flex-col items-center">
                <div class="player-name flex flex-row justify-center font-semibold mb-3" :title="player.name">
                    <img src="../assets/twitch.svg" class="w-3 mr-1" />
                    <span>{{ player.name }}</span>
                </div>
                <div class="flex items-center justify-center gap-1 mb-3">
                    <img class="w-6" :src="`/src/assets/faceit/lvl${+player.level}.svg`" />
                    <img class="w-6" src="../assets/faceit/elo.svg" />
                    <span class="font-semibold">{{ +player.elo }}</span>
                </div>
                <div class="avatar">
                    <div class="mask mask-circle max-w-[10rem]">
                        <img :src="player.image" />
                    </div>
                </div>
                <template v-if="(state.loggedIn && player.id !== state.user.display_name)">
                    <div v-if="shouldShowDuo(player)" class="absolute w-8 -right-2 -top-2" @click="sendRequest(player)">
                        <div class="tooltip w-full" data-tip="Ofrecer duo">
                            <div class="rounded-full bg-accent p-2 cursor-pointer">
                                <img src="../assets/heart.svg" />
                            </div>
                        </div>
                    </div>
                    <div v-else-if="shouldShowCancel(player)" class="absolute w-8 -right-2 -top-2"
                        @click="cancelRequest(player)">
                        <div class="tooltip w-full" data-tip="Cancelar oferta">
                            <div class="rounded-full bg-error p-1.5 cursor-pointer">
                                <img src="../assets/cancel.svg" />
                            </div>
                        </div>
                    </div>
                    <div v-else-if="shouldShowAccept(player)" class="absolute w-8 -right-2 -top-2"
                        @click="acceptRequest(player)">
                        <div class="tooltip w-full" data-tip="Aceptar duo">
                            <div class="rounded-full bg-accent p-[2px] cursor-pointer">
                                <img src="../assets/deal.svg" />
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, Ref, ref } from "vue";
import { Player, Couple, Request, PlayersResponse } from "../core/types";
import dataService from "../core/services/data.service";
import { useIdentityStore } from "../stores/identity.store";

const state = useIdentityStore();

const props = defineProps<{
    data: {
        playersResponse: PlayersResponse;
        myRequests?: Request[];
        myCouple?: Couple;
    }
}>();

const emits = defineEmits(["reload"]);

const players: Ref<Player[]> = ref([] as Player[]);
const singlePlayers: Ref<Player[]> = ref([] as Player[]);
const couples: Ref<Couple[]> = ref([] as Couple[]);

const lock = ref(false);

const getPlayerById = (id: string): Player | undefined => players.value.find(x => x.id == id);
const shouldShowDuo = (player: Player): boolean => !props.data.myCouple && !props.data.myRequests?.some(req => req.from === player.id || req.to === player.id);
const shouldShowAccept = (player: Player) => props.data.myRequests?.map(x => x.from).includes(player.id) ?? false;
const shouldShowCancel = (player: Player): boolean => props.data.myRequests?.map(x => x.to).includes(player.id) ?? false;
const sendRequest = (player: Player) => handleRequest(player, "send");
const cancelRequest = (player: Player) => handleRequest(player, "cancel");
const acceptRequest = (player: Player) => handleRequest(player, "accept");

const handleRequest = async (player: Player, action: "send" | "cancel" | "accept") => {
    lock.value = true;
    if (action === "send") {
        await dataService.sendRequest(player.id)
    } else if (action === "cancel") {
        await dataService.cancelRequest(player.id)
    } else if (action === "accept") {
        await dataService.acceptRequest(player.id)
    }

    emits("reload")
}

onBeforeMount(async () => {
    couples.value = props.data.playersResponse.couples;
    players.value = props.data.playersResponse.players;
    singlePlayers.value = props.data.playersResponse.players
        .filter(x =>
            !couples.value.map(x => x.player1).includes(x.id) &&
            !couples.value.map(x => x.player2).includes(x.id));
});
</script>

<style>
.player {
    max-width: calc(50% - 0.5rem);
}

.player-name {
    max-width: 100%;
    overflow: hidden;
}
</style>