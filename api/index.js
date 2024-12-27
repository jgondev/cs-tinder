require("dotenv").config();
const express = require("express");
const cors = require("cors");
const WebSockets = require("express-ws");
const mainRoutes = require("./routes/main.routes");
const sseRoutes = require("./routes/sse.routes");
const wsRoutes = require("./routes/ws.routes");

const app = express();
WebSockets(app);
app.use(express.json());
const port = process.env.PORT || 8080;
app.use(cors({
  origin: [process.env.APP_URL],
  allowedHeaders: ['x-access-token', 'Content-Type', 'Accept']
}));

//routes
mainRoutes(app);
sseRoutes(app);
wsRoutes(app);

app.get("/", (req, res) => {
  res.send("Bienvenido! 🚀");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
