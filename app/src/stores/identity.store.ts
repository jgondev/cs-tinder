import { defineStore } from "pinia";
import { Identity, User } from "../core/types";

export const useIdentityStore = defineStore("identity", {
    state: () => ({
        id: JSON.parse(localStorage.getItem('id') ?? '{}') as Identity,
    }),
    getters: {
        loggedIn: (state) => state.id?.token != undefined,
        user: (state) => state.id?.user,
    },
    actions: {
        setId(id: Identity) {
            localStorage.setItem('id', JSON.stringify(id));
            this.id = id;
        },
        updateUser(user: User) {
            this.id.user = user;
            this.setId(this.id);
        }
    },
});