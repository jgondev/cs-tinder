const sseService = require("../services/sse.service");

module.exports = function (app) {
    app.get("/sse", (req, res) => {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        res.write(`data: ${JSON.stringify({ message: "Connection established" })}\n\n`);

        sseService.addClient(res);

        req.on("close", () => {
            sseService.removeClient(res);
        });
    });
};