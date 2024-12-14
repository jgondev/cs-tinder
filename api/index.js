require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;
app.use(cors({
  origin: [process.env.APP_URL],
  allowedHeaders: ['x-access-token', 'Content-Type', 'Accept']
}));

//routes
require("./routes")(app);

app.get("/", (req, res) => {
  res.send("Bienvenido! 🚀");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
