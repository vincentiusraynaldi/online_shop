import { Options } from '@mikro-orm/core';
import { 
    Order, 
    Item, 
    User, 
    Category, 
    Cart, 
    Address, 
    Wishlist,
    CartItem,
    OrderItem 
} from './entity';

const options: Options = {
    type: 'postgresql',
    entities: [Item, User, Order, Category, Cart, Address, Wishlist, CartItem, OrderItem],
    // host: 'localhost' ||  'database', //'database' is from the docker container name for the postgresql image
    host: 'localhost', //'database' is from the docker container name for the postgresql image
    dbName: process.env.POSTGRES_DB,
    // dbName: 'online_shop_DB',
    password: process.env.POSTGRES_PASSWORD,
    // password: 'online_shop123',
    user: process.env.POSTGRES_USER,
    // user: 'online_shop',
    debug: true,
    port: 5432,
};

export default options;