import { BaseSocialService, ISocialConfig } from './social.service';
import apiService from './api.service';
import { Identity, User } from '../types';

export class FaceitService extends BaseSocialService {
    constructor() {
        const config = {
            clientId: '9b931ab4-dce7-4d71-9504-d7a0a3d683e0',
            redirectUri: 'https://localhost:4006/auth/faceit',
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
}

export default new FaceitService();

