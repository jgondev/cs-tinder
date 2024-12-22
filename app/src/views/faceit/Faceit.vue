<template>
    <div class="w-full bg-base-100 rounded-2xl px-3 py-10 shadow-lg">
        <h2 class="text-5xl font-bold text-center">FACEIT</h2>
        <p class="p-10 text-center font-light">
            Conecta con tu cuenta de Faceit, si no tienes, ahora es el momento de
            crearla.
        </p>

        <div class="text-center">
            <a :href="faceitUrl" class="btn btn-primary text-white">
                Conectar con Faceit
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import faceitService from '../../core/services/faceit.service';

const faceitUrl = ref();
onBeforeMount(async () => {
    faceitUrl.value = await faceitService.getAuthorizeUrl('/', true);
});
</script>