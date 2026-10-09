import http from "http";
import {
    Item, User, Order, Category, Cart, Wishlist, Address, CartItem, OrderItem
} from "./entity";
import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/postgresql";
import config from './mikro-orm.config';
import Stripe from "stripe";

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    itemRepository: EntityRepository<Item>;
    userRepository: EntityRepository<User>;
    orderRepository: EntityRepository<Order>;
    categoryRepository: EntityRepository<Category>;
    cartRepository: EntityRepository<Cart>;
    wishlistRepository: EntityRepository<Wishlist>;
    addressRepository: EntityRepository<Address>;
    cartItemRepository: EntityRepository<CartItem>;
    orderItemRepository: EntityRepository<OrderItem>;
    stripe: Stripe;
}

export const initializeORM = async (ormConfig = config) => {
    DI.orm = await MikroORM.init(ormConfig);
    DI.em = DI.orm.em;
    DI.itemRepository = DI.orm.em.getRepository(Item);
    DI.userRepository = DI.orm.em.getRepository(User);
    DI.orderRepository = DI.orm.em.getRepository(Order);
    DI.categoryRepository = DI.orm.em.getRepository(Category);
    DI.cartRepository = DI.orm.em.getRepository(Cart);
    DI.wishlistRepository = DI.orm.em.getRepository(Wishlist);
    DI.addressRepository = DI.orm.em.getRepository(Address);
    DI.cartItemRepository = DI.orm.em.getRepository(CartItem);
    DI.orderItemRepository = DI.orm.em.getRepository(OrderItem);
}