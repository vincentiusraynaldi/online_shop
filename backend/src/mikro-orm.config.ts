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
    host: 'localhost',
    dbName: 'online_shop_DB',
    password: 'online_shop123',
    user: 'online_shop',
    debug: true,
    port: 5432,
};

export default options;