"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const item_1 = require("./entities/item");
const user_1 = require("./entities/user");
const options = {
    type: 'postgresql',
    entities: [item_1.Item, user_1.User],
    host: 'localhost',
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    user: 'jasa_titip',
    debug: true,
    port: 5432,
};
exports.default = options;
