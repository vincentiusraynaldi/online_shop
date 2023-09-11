import { Options } from '@mikro-orm/core';
import { Item } from './entities/item';

const options: Options = {
    type: 'postgresql',
    entities: [Item],
    host: 'localhost',
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    user: 'jasa_titip',
    debug: true,
    port: 5432,
};

export default options;