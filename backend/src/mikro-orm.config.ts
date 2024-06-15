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
    host: 'database' || 'localhost', //'database' is from the docker container name for the postgresql image
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    user: 'jasa_titip',
    debug: true,
    port: 5432,
};

export default options;