import { defineStore } from "pinia";
import { PlayersResponse } from "../core/types";
import dataService from "../core/services/data.service";

export const usePlayersStore = defineStore("players", {
    state: () => ({
        players: JSON.parse(localStorage.getItem('players') ?? '{}') as PlayersResponse,
    }),
    getters: {
        playersResponse: (state) => state.players,
    },
    actions: {
        setPlayers(playersResponse: PlayersResponse) {
            localStorage.setItem('players', JSON.stringify(playersResponse));
            this.players = playersResponse;
        },
        async updatePlayers() {
            const players = await dataService.getPlayers();
            this.setPlayers(players);
            console.log('Players updated');
        }
    },
});