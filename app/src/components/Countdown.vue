<template>
    <div class="flex flex-row gap-5 justify-center">
        <div class="flex flex-col items-center">
            <span class="countdown font-extrabold text-7xl">
                <span :style="`--value:${countdown.days};`"></span>
            </span>
            días
        </div>
        <div class="flex flex-col items-center">
            <span class="countdown font-extrabold text-7xl">
                <span :style="`--value:${countdown.hours};`"></span>
            </span>
            horas
        </div>
        <div class="flex flex-col items-center">
            <span class="countdown font-extrabold text-7xl">
                <span :style="`--value:${countdown.minutes};`"></span>
            </span>
            minutos
        </div>
        <div class="flex flex-col items-center">
            <span class="countdown font-extrabold text-7xl">
                <span :style="`--value:${countdown.sec};`"></span>
            </span>
            segundos
        </div>
    </div>
    <div class="flex justify-center mt-5 text-xs text-secondary">
        {{ date }}
    </div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import { computed, ref, Ref } from 'vue';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es')

const props = defineProps<{
    limit: Date;
}>();

const now: Ref<number> = ref((new Date()).getTime())
const date = dayjs(props.limit)
    .tz('Europe/Madrid')
    .format('dddd D [de] MMMM [de] YYYY [a las] HH:mm [CET]');

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