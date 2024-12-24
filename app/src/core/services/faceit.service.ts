import { BaseSocialService, ISocialConfig } from './social.service';
import apiService from './api.service';
import { Identity, User } from '../types';

export class FaceitService extends BaseSocialService {
    constructor() {
        const config = {
            clientId: import.meta.env.VITE_FACEIT_CLIENT_ID,
            redirectUri: import.meta.env.VITE_FACEIT_REDIRECT_URI,
            responseType: 'code',
            scope: 'openid',
            authorizeUrl: 'https://accounts.faceit.com',
        } as ISocialConfig;

        super('faceit', config);
    }

    public async link(code: string, codeVerifier?: string): Promise<Identity> {
        return await apiService.post<Identity>(`/faceit`, { code, codeVerifier });
    }

    public async update(): Promise<User> {
        return await apiService.post<User>('/faceit/update');
    }

    public async teams(): Promise<any> {
        return await apiService.post<any>('/faceit/teams');
    }
}

export default new FaceitService();

