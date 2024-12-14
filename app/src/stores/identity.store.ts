import { defineStore } from "pinia";
import { Identity } from "../core/types";

export const useIdentityStore = defineStore("identity", {
    state: () => ({
        id: JSON.parse(localStorage.getItem('id') ?? '{}') as Identity,
    }),
    getters: {
        loggedIn: (state) => state.id?.token != undefined,
    },
    actions: {
        setId(id: Identity) {
            localStorage.setItem('id', JSON.stringify(id));
            this.id = id;
        }
    },
});