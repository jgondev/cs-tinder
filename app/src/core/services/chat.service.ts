import { Couple, Request, PlayersResponse } from "../types";
import apiService from "./api.service";

export class DataService {
    public async getPlayers(): Promise<PlayersResponse> {
        return await apiService.getSingle<PlayersResponse>('/players');
    }
}

export default new DataService();