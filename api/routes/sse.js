const express = require("express");
const { addClient, removeClient } = require("../services/sse.service");

const router = express.Router();

router.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: ${JSON.stringify({ message: "Connection established" })}\n\n`);

    addClient(res);

    req.on("close", () => {
        removeClient(res);
    });
});

module.exports = router;
