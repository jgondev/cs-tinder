require("dotenv").config();
const jwt = require("jsonwebtoken");
const twitchService = require("./twitch.service");
const faceitService = require('./faceit.service');
const Repo = require("./repo.service");

const userDb = new Repo("user");
const couplesDb = new Repo("couples");
const requestsDb = new Repo("requests");
const systemDb = new Repo("system");
const tokenDb = new Repo("tokens");

exports.login = async (req, res) => {
  try {
    const { code } = req.body;

    const token = await twitchService.getToken(code);
    const me = await twitchService.me(token);
    const isSub = await twitchService.isSub(token, me.id);

    if (!isSub) {
      console.error('User is not a subscriber');
      return res.send({ result: null });
    }

    try {
      const user = await userDb.put({ ...me, key: me.display_name });
      const jwtToken = jwt.sign({ id: me.display_name }, process.env.SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      try {
        await tokenDb.put({ key: user.key, token: jwtToken });
        return res.send({
          result: {
            user,
            token: jwtToken,
          },
        });
      } catch (tokenDbError) {
        console.error('Failed to save token to tokenDb:', tokenDbError);
        return res.send({ result: null });
      }
    } catch (userDbError) {
      console.error('Failed to save user to userDb:', userDbError);
      return res.send({ result: null });
    }
  } catch (error) {
    console.error('Error during login process:', error);
    return res.send({ result: null });
  }
};

exports.faceit = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userDb.get(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    const { code, codeVerifier } = req.body;

    if (!code || !codeVerifier) {
      return res.status(400).send({ error: 'Missing code or codeVerifier.' });
    }

    const token = await faceitService.getToken(code, codeVerifier);

    const faceitUser = await faceitService.me(token.access_token);

    if (!faceitUser) {
      console.error('Couldn\'t retrieve faceit user information.');
      return res.send({ result: null });
    }

    try {
      const updatedUser = await userDb.put({ ...user, faceit: faceitUser.nickname });
      const jwtToken = jwt.sign({ id: updatedUser.key }, process.env.SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      try {
        await tokenDb.put({ key: updatedUser.key, token: jwtToken });
        return res.send({
          result: {
            user: updatedUser,
            token: jwtToken,
          },
        });
      } catch (tokenDbError) {
        console.error('Failed to save token to tokenDb:', tokenDbError);
        return res.send({ result: null });
      }
    } catch (dbError) {
      console.error('Error updating user with Faceit information:', dbError);
      return res.send({ result: null });
    }
  } catch (error) {
    console.error('Error linking with Faceit:', error.message);
    return res.send({ result: null });
  }
};


exports.getPlayers = async (req, res) => {
  try {
    const users = await userDb.fetch();
    const validUsers = users.filter(x => x.faceit);

    if (validUsers && validUsers.length > 0) {
      const players = validUsers.map((x) => ({
        id: x.id,
        name: x.display_name,
        image: x.profile_image_url,
      }));

      const couples = await couplesDb.fetch();
      res.send({ result: { players: players, couples: couples ?? [] } });
    } else {
      res.send({ result: { players: [], couples: [] } });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};

exports.requestCouple = async (req, res) => {
  const userId = req.userId;
  const { target } = req.body;

  if (!userId) {
    console.error("Error: Missing userId");
    return res.status(403).send({ error: "Unauthorized" });
  }

  try {
    const userCouples = await couplesDb.fetch([
      { player1: userId },
      { player2: userId },
    ]);
    const targetCouples = await couplesDb.fetch([
      { player1: target },
      { player2: target },
    ]);

    if (userCouples || targetCouples) {
      console.warn("Warning: One or both users are already in a couple", {
        userId: userId,
        targetId: target,
      });
      return res.status(409).send({ error: "Conflict: User already in a couple" });
    }

    const reverseRequest = await requestsDb.fetch([{
      from: target,
      to: userId,
    }]);

    if (!reverseRequest) {
      try {
        const request = await requestsDb.put({ from: userId, to: target });
        console.log("Request created successfully", { request });
        return res.send({ result: request });
      } catch (error) {
        console.error("Error creating request", error);
        return res.status(500).send({ error: "Error creating request" });
      }
    }

    try {
      const couple = await couplesDb.put({ player1: target, player2: userId });
      console.log("Couple created successfully", { couple });

      const allRequests = await requestsDb.fetch([
        { from: userId },
        { from: target },
        { to: userId },
        { to: target },
      ]);

      if (allRequests) {
        console.log("Deleting related requests", { allRequests });
        for (const request of allRequests) {
          await requestsDb.remove(request.key);
          console.log("Request deleted", { requestKey: request.key });
        }
      }

      return res.send({ result: couple });
    } catch (error) {
      console.error("Error creating couple or deleting requests", error);
      return res.status(500).send({ error: "Error creating couple" });
    }
  } catch (error) {
    console.error("Unexpected error", error);
    return res.status(500).send({ error: "Unexpected server error" });
  }
};


exports.acceptCouple = async (req, res) => {
  const userId = req.userId;
  const { from } = req.body;

  if (!userId) {
    console.error("User ID is missing");
    return res.status(403).send({ error: "Unauthorized" });
  }

  try {
    const request = await requestsDb.fetch([{ from: from, to: userId }]);

    if (!request) {
      console.error("Request not found", { from, to: userId });
      return res.status(404).send({ error: "Request not found" });
    }

    const couple = await couplesDb.put({ player1: from.toString(), player2: userId.toString() });
    console.log("Couple created", couple);

    try {
      const allRequests = await requestsDb.fetch([
        { from: userId },
        { from: from },
        { to: userId },
        { to: from },
      ]);

      if (allRequests && allRequests.length > 0) {
        console.log("Found requests to remove", allRequests);
        for (const r of allRequests) {
          await requestsDb.remove(r.key);
          console.log("Request removed", r.key);
        }
      }
    } catch (error) {
      console.error("Error fetching or removing requests", error);
    }

    return res.send({ result: couple });
  } catch (error) {
    console.error("Error creating couple or processing requests", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};


exports.declineCouple = async (req, res) => {
  const userId = req.userId;
  const { from } = req.body;

  if (!userId) {
    return res.status(403).send();
  }

  try {
    const request = await requestsDb.fetch([{ from: from, to: userId }]);
    if (request && request.length > 0) {
      await requestsDb.remove(request[0].key);
      res.send({ result: true });
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};


exports.cancelRequest = async (req, res) => {
  const userId = req.userId;
  const { target } = req.body;

  if (!userId) {
    return res.status(403).send();
  }

  try {
    const request = await requestsDb.fetch([{ from: userId, to: target }]);
    if (request && request.length > 0) {
      await requestsDb.remove(request[0].key);
      res.send({ result: true });
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};


exports.getRequests = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    res.status(403).send({ error: "User not authorized" });
    return;
  }

  try {
    const requests = await requestsDb.fetch([{ from: userId }, { to: userId }]);

    if (requests) {
      res.send({
        result: requests.map((x) => ({
          from: x.from,
          to: x.to,
        })),
      });
    } else {
      res.send({ result: [] });
    }
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).send({ error: "Failed to fetch requests" });
  }
};

exports.getCouple = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(403).send();
  }

  try {
    const result = await couplesDb.fetch([{ player1: userId }, { player2: userId }]);
    if (result && result.length > 0) {
      res.send({ result: result[0] });
    } else {
      res.send({ result: undefined });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};


exports.breakCouple = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(403).send();
  }

  try {
    const result = await couplesDb.fetch([{ player1: userId }, { player2: userId }]);
    if (result && result.length > 0) {
      await couplesDb.remove(result[0].key);
      res.send({ result: true });
    } else {
      res.send({ result: false });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};


exports.gg = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(403).send();
  }

  try {
    // Eliminar parejas
    const couple = await couplesDb.fetch([{ player1: userId }, { player2: userId }]);
    if (couple && couple.length > 0) {
      for (const x of couple) {
        await couplesDb.remove(x.key);
      }
    }

    // Eliminar solicitudes
    const requests = await requestsDb.fetch([{ from: userId }, { to: userId }]);
    if (requests && requests.length > 0) {
      for (const x of requests) {
        await requestsDb.remove(x.key);
      }
    }

    // Eliminar usuario
    await userDb.remove(userId);

    res.send({ result: true });
  } catch (error) {
    res.status(500).send({ error });
  }
};


exports.systemUpdates = async (req, res) => {
  try {
    const updated = await systemDb.get("updated");
    if (updated) {
      res.send({ result: updated.value });
    } else {
      res.status(500).send({ error: "No updates found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve updates" });
  }
};
