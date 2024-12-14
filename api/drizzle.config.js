require('dotenv').config();

module.exports = {
  out: "./drizzle/migrations",
  schema: "./schema.js",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  }
};
