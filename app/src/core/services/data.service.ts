import { Couple, Request, PlayersResponse } from "../types";
import apiService from "./api.service";

export class DataService {
    public async getPlayers(): Promise<PlayersResponse> {
        return await apiService.getSingle<PlayersResponse>('/players');
    }

    public async getRequests(): Promise<Request[]> {
        return await apiService.getMany<Request>('/requests');
    }

    public async sendRequest(target: string): Promise<Request> {
        return await apiService.post<Request>('/requests/send', { target: target });
    }

    public async cancelRequest(playerId: string): Promise<Couple> {
        return await apiService.post<Couple>('/requests/cancel', { target: playerId })
    }

    public async acceptRequest(playerId: string): Promise<Couple> {
        return await apiService.post<Couple>('/requests/accept', { from: playerId })
    }

    public async declineRequest(playerId: string): Promise<Couple> {
        return await apiService.post<Couple>('/requests/decline', { from: playerId })
    }

    public async getCouple(): Promise<Couple> {
        return await apiService.getSingle<Couple>('/couples/mine');
    }

    public async breakCouple(): Promise<boolean> {
        return await apiService.post<boolean>('/couples/mine/break');
    }

    public async gg(): Promise<boolean> {
        return await apiService.post<boolean>('/gg');
    }

    public async latestUpdate(): Promise<number> {
        return await apiService.getSingle<number>('/system/update')
    }
}

export default new DataService();