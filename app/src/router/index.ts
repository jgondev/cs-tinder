import { createRouter, createWebHistory } from "vue-router";

import Home from '../views/home/Home.vue';
import Error from '../views/error/Error.vue';
import TwitchAuth from '../views/system/TwitchAuth.vue';
import FaceitAuth from '../views/system/FaceitAuth.vue';
import Faceit from '../views/faceit/Faceit.vue';

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
    name: "twitchAuth",
    component: TwitchAuth,
  },
  {
    path: "/auth/faceit",
    name: "faceitAuth",
    component: FaceitAuth,
  },
  {
    path: "/faceit",
    name: "faceit",
    component: Faceit,
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  try {
    const storedData = localStorage.getItem("id");
    if (storedData) {
      const identity = JSON.parse(storedData);
      if ((!identity.user || !identity.user.faceit) && to.name === "home") {
        next({ name: "faceit" });
        return;
      }
    }
  } catch (error) {
    console.error("Error parsing identity from localstorage:", error);
  }

  next();
});

export default router;