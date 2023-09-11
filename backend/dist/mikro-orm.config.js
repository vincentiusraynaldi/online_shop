"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const item_1 = require("./entities/item");
const options = {
    type: 'postgresql',
    entities: [item_1.Item],
    host: 'localhost',
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    user: 'jasa_titip',
    debug: true,
    port: 5432,
};
exports.default = options;
