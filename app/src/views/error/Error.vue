<template>
    <div class="bg-base-100 shadow rounded-2xl flex flex-col items-center">
        <img src="../../assets/404.png" class="max-w-xs mb-20" alt="404" />
        <router-link :to="{ name: 'home' }">
            <button class="btn btn-sm btn-secondary text-white mb-10">Sácame de aquí</button>
        </router-link>
    </div>
</template>
