<template>
    <div class="flex flex-row gap-5 justify-center">
        <div class="flex flex-col items-center">
            <span class="countdown font-mono text-5xl">
                <span :style="`--value:${countdown.days};`"></span>
            </span>
            días
        </div>
        <div class="flex flex-col items-center">
            <span class="countdown font-mono text-5xl">
                <span :style="`--value:${countdown.hours};`"></span>
            </span>
            horas
        </div>
        <div class="flex flex-col items-center">
            <span class="countdown font-mono text-5xl">
                <span :style="`--value:${countdown.minutes};`"></span>
            </span>
            minutos
        </div>
        <div class="flex flex-col items-center">
            <span class="countdown font-mono text-5xl">
                <span :style="`--value:${countdown.sec};`"></span>
            </span>
            segundos
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { computed, ref, Ref } from 'vue';

dayjs.extend(relativeTime);

const props = defineProps<{
    limit: Date;
}>();

const now: Ref<number> = ref((new Date()).getTime())

const countdown = computed(() => {
    const ms = Math.max(0, props.limit.getTime() - now.value);
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const sec = Math.floor(minutesms / 1000);

    return {
        days: days,
        hours: hours, 
        minutes: minutes, 
        sec: sec
    }
})

onMounted(() => {
    setInterval(() => {
        now.value = (new Date()).getTime();
    }, 1000)
})
</script>