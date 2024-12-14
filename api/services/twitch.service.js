const axios = require("axios");

class TwitchService {
  config = {
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    redirectUri: process.env.TWITCH_REDIRECT_URI,
    tokenUrl: "https://id.twitch.tv/oauth2/token",
    baseApi: "https://api.twitch.tv/helix",
    broadcasterId: process.env.BROADCASTER_ID,
  };

  async getToken(code) {
    const body = new URLSearchParams();
    body.append("client_id", this.config.clientId);
    body.append("client_secret", this.config.clientSecret);
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", this.config.redirectUri);

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    let token = null;
    token = await axios
      .post(this.config.tokenUrl, body, { headers })
      .then((response) => {
        return response?.data;
      });

    return token;
  }

  async refreshToken(token) {
    const body = new URLSearchParams();
    body.append("client_id", this.config.clientId);
    body.append("client_secret", this.config.clientSecret);
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", encodeURIComponent(token.refresh_token));

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    return await axios
      .post(this.config.tokenUrl, body, { headers })
      .then((response) => {
        return response?.data;
      });
  }

  authHeaders = (bearer) => {
    return {
      "Authorization": `Bearer ${bearer}`,
      "Client-ID": this.config.clientId
    };
  };

  async me(token) {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    return await axios
      .get(`${this.config.baseApi}/users`, {
        headers: this.authHeaders(token.access_token),
      })
      .then((response) => {
        if (response.data.data.length > 0) {
          let me = response.data.data[0];
          delete me.created_at;
          return me;
        } else {
          return null
        }
      })
      .catch(() => {
        return null;
      });
  }

  async isSub(token, userId) {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    return await axios
      .get(`${this.config.baseApi}/subscriptions/user?broadcaster_id=${this.config.broadcasterId}&user_id=${userId}`, {
        headers: this.authHeaders(token.access_token),
      })
      .then((response) => {
        console.log("twitch response", JSON.stringify(response.data.data[0]));
        if (response.data.data.length > 0) {
          return response.data.data[0]
        } else {
          return null
        }
      })
      .catch(() => {
        return null;
      });
  }
}

module.exports = new TwitchService();
