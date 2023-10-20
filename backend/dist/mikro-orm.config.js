"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entities_1 = require("./entities");
const options = {
    type: 'postgresql',
    entities: [entities_1.Item, entities_1.User, entities_1.Order],
    host: 'localhost',
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    user: 'jasa_titip',
    debug: true,
    port: 5432,
};
exports.default = options;
