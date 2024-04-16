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
    OrderItem,
    WishlistUserItem
} from './entity';

const options: Options = {
    type: 'postgresql',
    entities: [Item, User, Order, Category, Cart, Address, Wishlist, CartItem, OrderItem, WishlistUserItem],
    host: 'localhost',
    dbName: 'jasa_titip_DB',
    password: 'jasa_titip123',
    user: 'jasa_titip',
    debug: true,
    port: 5432,
};

export default options;