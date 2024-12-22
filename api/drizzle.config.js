require('dotenv').config();

module.exports = {
  out: "./drizzle/migrations/dev",
  schema: "./schema.js",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_URL_DEV,
    authToken: process.env.TURSO_AUTH_TOKEN_DEV
  }
};
