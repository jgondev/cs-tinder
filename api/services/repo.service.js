const SchemaService = require('./schema.service');
const { broadcast } = require("./sse.service");
const { drizzle } = require("drizzle-orm/libsql");
const { createClient } = require("@libsql/client");
const { eq, and, or } = require("drizzle-orm");

class BaseRepo {
  constructor(tableName) {
    const client = createClient({ url: process.env.TURSO_DB_URL, authToken: process.env.TURSO_AUTH_TOKEN });

    this.db = drizzle(client);
    this.table = SchemaService.getTable(tableName);
    this.systemTable = SchemaService.getTable("system");

    if (!this.table) {
      throw new Error(`La tabla "${tableName}" no está definida en el esquema.`);
    }
  }

  async get(key) {
    try {
      const result = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.key, key));

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error getting data:", error);
      return null;
    }
  }

  async put(src) {
    const obj = Object.fromEntries(
      Object.entries(src).filter(([_, value]) => value !== null && value !== "")
    );

    try {
      let result;

      if (obj.key) {
        const dbObj = await this.db
          .select()
          .from(this.table)
          .where(eq(this.table.key, obj.key));

        if (dbObj.length > 0) {
          result = await this.db
            .update(this.table)
            .set({ ...obj })
            .where(eq(this.table.key, obj.key))
            .returning();
        } else {
          result = await this.db
            .insert(this.table)
            .values({ ...obj })
            .returning();
        }
      } else {
        result = await this.db
          .insert(this.table)
          .values({ ...obj })
          .returning();
      }

      await this._updateSystemTimestamp();
      return result[0];
    } catch (error) {
      console.error("Error putting data:", error, JSON.stringify(obj));
      return null;
    }
  }

  async remove(key) {
    try {
      await this.db.delete(this.table).where(eq(this.table.key, key));
      await this._updateSystemTimestamp();
    } catch (error) {
      console.error("Error removing data:", error);
    }
  }

  async insert(obj) {
    try {
      const result = await this.db.insert(this.table).values(obj);
      await this._updateSystemTimestamp();
      return result;
    } catch (error) {
      console.error("Error inserting data:", error);
      return null;
    }
  }

  async putMany(objs) {
    try {
      const result = await this.db.insert(this.table).values(objs);
      await this._updateSystemTimestamp();
      return result;
    } catch (error) {
      console.error("Error putting many data:", error);
      return null;
    }
  }

  async fetch(conditions) {
    try {
      let query = this.db.select().from(this.table);

      if (conditions && conditions.length > 0) {
        const orConditions = conditions.map(conditionObj => {
          const andClauses = Object.entries(conditionObj).map(([key, value]) => {
            return eq(this.table[key], value);
          });
          return and(...andClauses);
        });

        query = query.where(or(...orConditions));
      }

      const result = await query;
      return result.length > 0 ? result : null;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  async _updateSystemTimestamp() {
    try {
      const timestamp = Date.now();
      await this.db
        .update(this.systemTable)
        .set({ value: timestamp })
        .where(eq(this.systemTable.key, "updated"));

      broadcast({ key: "updated", value: timestamp });
    } catch (error) {
      console.error("Error updating system timestamp:", error);
    }
  }
}

module.exports = BaseRepo;
