require("dotenv").config();
const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }


  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    req.userId = decoded.id;
    req.token = token;
    next();
  });
};

const wsVerifyToken = (ws, req, next) => {
  const token = req.query.token;

  if (!token) {
    ws.close(4001, 'No token provided');
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("WebSocket authentication failed:", err);
    ws.close(4001, 'Authentication failed');
    return;
  }
};

const middleware = {
  verifyToken,
  wsVerifyToken
};

module.exports = middleware;
