import { Identity } from '../types';
import apiService from './api.service';

export abstract class BaseSocialService {
    public social: string;
    public config: ISocialConfig;
    public authQuery?: string;

    constructor(social: string, config: ISocialConfig, authQuery?: string) {
        this.social = social;
        this.config = config;
        this.authQuery = authQuery;
    }

    public async login(code: string): Promise<Identity> {
        return await apiService.post<Identity>(`/login`, { code: code });
    }

    public getAuthorizeUrl(returnTo: string): string {
        const q = new URLSearchParams();
        q.append("client_id", this.config.clientId);
        q.append("redirect_uri", this.config.redirectUri);
        q.append("response_type", this.config.responseType);
        q.append("scope", this.config.scope);

        return `${this.config.authorizeUrl}?${q.toString()}${this.authQuery ?? ''}&state=${returnTo}`
    }
}

export interface ISocialConfig {
    clientId: string;
    redirectUri: string;
    responseType: string;
    scope: string;
    authorizeUrl: string;
}