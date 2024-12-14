import { BaseSocialService, ISocialConfig } from './social.service';

export class TwitchService extends BaseSocialService {

    constructor() {
        const config = {
            clientId: '60o8krmwt9zra3887a3648k3solizu',
            //redirectUri: 'https://cs-tinder.fly.dev/auth/twitch',
            redirectUri: 'http://localhost:4006/auth/twitch',
            responseType: 'code',
            scope: 'user:read:subscriptions',
            authorizeUrl: 'https://id.twitch.tv/oauth2/authorize',
        } as ISocialConfig

        super('twitch', config);
    }
}

export default new TwitchService();