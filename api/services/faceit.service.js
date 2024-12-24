const axios = require('axios');

class FaceitService {
    config = {
        clientId: process.env.FACEIT_CLIENT_ID,
        clientSecret: process.env.FACEIT_CLIENT_SECRET,
        apiKey: process.env.FACEIT_API_KEY,
        redirectUri: process.env.FACEIT_REDIRECT_URI,
        tokenUrl: "https://api.faceit.com/auth/v1/oauth/token",
        dataUrl: "https://open.faceit.com/data/v4"
    };

    async getToken(code, codeVerifier) {
        const body = new URLSearchParams();
        body.append("grant_type", "authorization_code");
        body.append("code", code);
        body.append("redirect_uri", this.config.redirectUri);
        body.append("code_verifier", codeVerifier);

        const credentials = Buffer.from(
            `${this.config.clientId}:${this.config.clientSecret}`
        ).toString("base64");

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Authorization": `Basic ${credentials}`,
            "Accept": "application/json",
            "Accept-Encoding": "identity"
        };

        try {
            const response = await axios.post(this.config.tokenUrl, body, { headers });
            return response.data;
        } catch (error) {
            console.error("Full error object:", error);
            console.error("Error obtaining Faceit token:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                response: error.response,
                code: error.code,
                isAxiosError: error.isAxiosError,
                config: error.config
            });
            throw new Error("Error obtaining Faceit token.");
        }
    }

    async me(accessToken) {
        const headers = {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json",
            "Accept-Encoding": "identity"
        };

        try {
            const response = await axios.get("https://api.faceit.com/auth/v1/resources/userinfo", { headers });
            return {
                nickname: response.data.nickname
            };
        } catch (error) {
            console.error("Error obtaining Faceit user data:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            throw new Error("Error obtaining Faceit user data.");
        }
    }

    async cs2info(user) {
        const headers = {
            "Authorization": `Bearer ${this.config.apiKey}`,
            "Accept": "application/json",
            "Accept-Encoding": "identity"
        };

        try {
            const response = await axios.get(`${this.config.dataUrl}/players`, { headers, params: { nickname: user } });
            const level = response.data.games.cs2?.skill_level ?? '3';
            const elo = response.data.games.cs2?.faceit_elo ?? '1000';
            return { level, elo };
        } catch (error) {
            console.error("Error obtaining Faceit user data:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            throw new Error("Error obtaining Faceit user data.");
        }
    }

    async championshipInfo(championship) {
        const headers = {
            "Authorization": `Bearer ${this.config.apiKey}`,
            "Accept": "application/json",
            "Accept-Encoding": "identity"
        };

        try {
            let allSubscriptions = [];
            let offset = 0;
            let moreItems = true;

            while (moreItems) {
                const response = await axios.get(`${this.config.dataUrl}/championships/${championship}/subscriptions`, {
                    headers,
                    params: { offset, limit: 10 }
                });

                allSubscriptions = [...allSubscriptions, ...response.data.items];
                moreItems = response.data.items.length === 10;
                offset += 10;
            }

            return { data: allSubscriptions };
        } catch (error) {
            console.error("Error obtaining Faceit championship data:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            throw new Error("Error obtaining Faceit championship data.");
        }
    }

}

module.exports = new FaceitService();
