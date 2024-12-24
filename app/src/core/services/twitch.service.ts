import { BaseSocialService, ISocialConfig } from './social.service';

export class TwitchService extends BaseSocialService {

    constructor() {
        const config = {
            clientId: import.meta.env.VITE_TWITCH_CLIENT_ID,
            redirectUri: import.meta.env.VITE_TWITCH_REDIRECT_URI,
            responseType: 'code',
            scope: 'user:read:subscriptions',
            authorizeUrl: 'https://id.twitch.tv/oauth2/authorize',
        } as ISocialConfig

        super('twitch', config);
    }
}

export default new TwitchService();