import { Options } from '@mikro-orm/core';
import { Item } from './entities/item';

const options: Options = {
    type: 'postgresql',
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    host: 'localhost',
    user: 'jasa_titip',
    debug: true,
    entities: [Item],
    port: 5432,
};