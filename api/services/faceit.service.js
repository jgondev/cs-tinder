const axios = require('axios');

class FaceitService {
    config = {
        clientId: process.env.FACEIT_CLIENT_ID,
        clientSecret: process.env.FACEIT_CLIENT_SECRET,
        redirectUri: process.env.FACEIT_REDIRECT_URI,
        tokenUrl: "https://api.faceit.com/auth/v1/oauth/token",
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
}

module.exports = new FaceitService();
