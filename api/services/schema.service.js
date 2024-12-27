const { user, couples, requests, system, tokens, messages } = require("../schema");

class SchemaService {
    constructor() {
        this.schema = {
            user,
            couples,
            requests,
            system,
            tokens,
            messages
        };
    }

    getTable(tableName) {
        return this.schema[tableName];
    }
}

module.exports = new SchemaService();