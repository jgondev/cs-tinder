const { sqliteTable: table } = require("drizzle-orm/sqlite-core");
const t = require("drizzle-orm/sqlite-core");

// Tabla de usuarios
const user = table("user", {
    key: t.text("key").primaryKey(),
    faceit: t.text("faceit"),
    id: t.text("id"),
    login: t.text("login"),
    display_name: t.text("display_name"),
    profile_image_url: t.text("profile_image_url"),
});

// Tabla de parejas
const couples = table("couples", {
    key: t.int("key").primaryKey({ autoIncrement: true }),
    player1: t.text("player1"),
    player2: t.text("player2"),
});

// Tabla de solicitudes
const requests = table("requests", {
    key: t.int().primaryKey({ autoIncrement: true }),
    from: t.text("from"),
    to: t.text("to"),
});

// Tabla de sistema (actualizaciones)
const system = table("system", {
    key: t.text("key").primaryKey(),
    value: t.int("value"),
});

// Tabla de tokens
const tokens = table("tokens", {
    key: t.text().primaryKey(),
    token: t.text("token"),
});

module.exports = {
    user,
    couples,
    requests,
    system,
    tokens,
};
