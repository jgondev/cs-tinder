import { createRouter, createWebHistory } from "vue-router";

import Home from '../views/home/Home.vue';
import Error from '../views/error/Error.vue';
import Auth from '../views/system/Auth.vue';

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/:pathMatch(.*)*",
    component: Error,
  },
  {
    path: "/auth/twitch",
    name: "auth",
    component: Auth,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

export default router;