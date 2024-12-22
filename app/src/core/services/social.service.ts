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
        return await apiService.post<Identity>(`/login`, { code });
    }

    public async getAuthorizeUrl(returnTo: string, usePKCE?: boolean): Promise<string> {
        let codeChallenge = '';
        if (usePKCE) {
            const codeVerifier = this.generateCodeVerifier();
            codeChallenge = await this.generateCodeChallenge(codeVerifier);
            localStorage.setItem(`${this.social}_code_verifier`, codeVerifier);
        }

        const q = new URLSearchParams();
        q.append('client_id', this.config.clientId);
        q.append('redirect_uri', this.config.redirectUri);
        q.append('response_type', this.config.responseType);
        q.append('scope', this.config.scope);

        if (usePKCE) {
            q.append('code_challenge', codeChallenge);
            q.append('code_challenge_method', 'S256');
            q.append('redirect_popup', 'true');
        }

        return `${this.config.authorizeUrl}?${q.toString()}${this.authQuery ?? ''}&state=${returnTo}`;
    }


    private generateCodeVerifier(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = '';
        for (let i = 0; i < 128; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    private async generateCodeChallenge(codeVerifier: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(hash)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
}

export interface ISocialConfig {
    clientId: string;
    redirectUri: string;
    responseType: string;
    scope: string;
    authorizeUrl: string;
}
