<template>
    <div class="grid gap-4 grid-cols-12 mt-5 w-full" :class="lock ? 'pointer-events-none opacity-50' : ''">
        <div v-if="data.myCouple" class="relative col-span-10 bg-base-100 rounded-2xl px-5 py-5 shadow-lg">
            <div
                class="relative col-span-2 p-5 rounded-xl shadow border-base-200 border-2 border-solid flex flex-row justify-between gap-16">
                <div>
                    <div class="text-center font-bold mb-3">{{ getPlayerById(data.myCouple.player1)!.name }}</div>
                    <div class="avatar">
                        <div class="mask mask-squircle">
                            <img :src="getPlayerById(data.myCouple.player1)!!.image" />
                        </div>
                    </div>
                </div>
                <img src="../assets/knives.svg" class="absolute w-20 -ml-10 top-3 left-1/2" />
                <div>
                    <div class="text-center font-bold mb-3">{{ getPlayerById(data.myCouple.player2)!.name }}</div>
                    <div class="avatar">
                        <div class="mask mask-squircle">
                            <img :src="getPlayerById(data.myCouple.player2)!.image" />
                        </div>
                    </div>
                </div>
                <div class="absolute w-12 h-12 -top-3 -right-3">
                    <div class="tooltip" data-tip="Romper duo">
                        <button class="btn btn-error p-2 rounded-full" @click="breakCouple">
                            <img src="../assets/broken-heart.svg" class="w-10" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="mt-5 text-lg font-semibold text-center">
                El siguiente paso es inscribiros en <a class="text-blue-500" target="_blank"
                    href="https://www.faceit.com/es/championship/e193606e-ecfd-41ca-87e3-6fa318fc2729">FACEIT</a>
            </div>
        </div>
        <template v-else>
            <div class="col-span-12 sm:col-span-5 bg-base-100 rounded-2xl px-5 py-5 shadow-lg">
                <h3 class="text-center text-lg font-bold mb-3">Ofertas recibidas</h3>
                <div v-if="(received && received.length > 0)" v-for="p in received"
                    class="mt-2 border-2 border-dashed rounded-xl p-2 flex flex-row justify-between items-center">
                    <span class="ml-2 font-bold">{{ p.name }}</span>
                    <div class="flex flex-row">
                        <div class="tooltip" data-tip="Aceptar duo">
                            <button class="btn btn-sm btn-primary px-1 mr-1" @click="accept(p)"><img
                                    src="../assets/deal.svg" class="w-7" /></button>
                        </div>
                        <div class="tooltip" data-tip="Declinar oferta">
                            <button class="btn btn-sm btn-error px-2" @click="decline(p)"><img
                                    src="../assets/cancel.svg" class="w-5" /></button>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center">De momento vas SoloQ </div>
            </div>
            <div class="col-span-12 sm:col-span-5 bg-base-100 rounded-2xl px-5 py-5 shadow-lg">
                <h3 class="text-center text-lg font-bold mb-3">Ofertas enviadas</h3>
                <div v-if="(sent && sent.length > 0)" v-for="p in sent"
                    class="mt-2 border-2 border-dashed rounded-xl p-2 flex flex-row justify-between items-center">
                    <span class="ml-2 font-bold">{{ p.name }}</span>
                    <div class="tooltip" data-tip="Cancelar invitación">
                        <button class="btn btn-sm btn-error px-2" @click="cancel(p)"><img src="../assets/cancel.svg"
                                class="w-5" /></button>
                    </div>
                </div>
                <div v-else class="text-center">De momento vas SoloQ </div>
            </div>
        </template>
        <div class="col-span-12 sm:col-span-2 bg-base-100 rounded-2xl px-5 py-5 shadow-lg h-fit flex justify-center">
            <div class="tooltip tooltip-top" data-tip="Retirarme del torneo">
                <button class="btn btn-lg" @click="gg">GG</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import dataService from '../core/services/data.service';
import { Couple, Player, Request } from '../core/types';
import { useIdentityStore } from '../stores/identity.store';

const state = useIdentityStore();

const props = defineProps<{
    data: {
        allPlayers: Player[];
        myRequests?: Request[];
        myCouple?: Couple;
    };
}>();

const emits = defineEmits(["reload"]);

const received: Ref<Player[] | undefined> = ref();
const sent: Ref<Player[] | undefined> = ref();

const lock = ref(false);

const accept = async (player: Player) => {
    lock.value = true;
    await dataService.acceptRequest(player.id).then(() => {
        emits("reload");
    })
}

const decline = async (player: Player) => {
    lock.value = true;
    await dataService.declineRequest(player.id)
        .then(() => {
            emits("reload");
        })
}

const cancel = async (player: Player) => {
    lock.value = true;
    await dataService.cancelRequest(player.id)
        .then(() => {
            emits("reload");
        })
}

const gg = async () => {
    lock.value = true;
    await dataService.gg()
        .then(() => {
            localStorage.clear();
            window.location.href = '/';
        })
}

const breakCouple = async () => {
    lock.value = true;
    await dataService.breakCouple()
        .then(() => {
            emits("reload");
        })
}

const getPlayerById = (id: string): Player | undefined => {
    return props.data.allPlayers.find(x => x.id == id);
}

onMounted(() => {
    const rec = props.data.myRequests?.filter(x => x.to == state.id.user.id);
    if (rec) {
        received.value = [];
        rec.map(x => {
            const player = props.data.allPlayers?.find(p => p.id == x.from);
            if (player) {
                received.value?.push(player);
            }
        });
    }
    const snt = props.data.myRequests?.filter(x => x.from == state.id.user.id);
    if (snt) {
        sent.value = [];
        snt.map(x => {
            const player = props.data.allPlayers?.find(p => p.id == x.to);
            if (player) {
                sent.value?.push(player);
            }
        });
    }
});
</script>