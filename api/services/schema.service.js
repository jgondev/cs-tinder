const { user, couples, requests, system, tokens } = require("../schema");

class SchemaService {
    constructor() {
        this.schema = {
            user,
            couples,
            requests,
            system,
            tokens,
        };
    }

    getTable(tableName) {
        return this.schema[tableName];
    }
}

module.exports = new SchemaService();