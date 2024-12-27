const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth.middleware");
const chatService = require("../services/chat.service");

module.exports = function (app) {
    router.ws("/chat", (ws, req) => {
        middleware.wsVerifyToken(ws, req, () => {
            console.log("Chat connection established for user:", req.userId);
            chatService.handleConnection(ws, req);
        });
    });

    app.use("/ws", router);
};