import { Options } from '@mikro-orm/core';
import { Order, Item, User } from './entities';

const options: Options = {
    type: 'postgresql',
    entities: [Item, User, Order],
    host: 'localhost',
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    user: 'jasa_titip',
    debug: true,
    port: 5432,
};

export default options;