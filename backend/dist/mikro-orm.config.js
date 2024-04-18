"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entity");
const options = {
    type: 'postgresql',
    entities: [entity_1.Item, entity_1.User, entity_1.Order, entity_1.Category, entity_1.Cart, entity_1.Address, entity_1.Wishlist, entity_1.CartItem, entity_1.OrderItem],
    host: 'localhost',
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    user: 'jasa_titip',
    debug: true,
    port: 5432,
};
exports.default = options;
