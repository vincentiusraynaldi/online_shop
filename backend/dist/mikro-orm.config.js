"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const item_1 = require("./entities/item");
const options = {
    type: 'postgresql',
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    host: 'localhost',
    user: 'jasa_titip',
    debug: true,
    entities: [item_1.Item],
    port: 5432,
};
