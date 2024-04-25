import express from "express";
import cors from "cors";
import http from "http";
import { 
    Item, 
    User, 
    Order,
    Category,
    Cart,
    Wishlist,
    Address,
    CartItem,
    OrderItem
    } from "./entity";

import { 
    itemRouter, 
    userRouter,
    categoryRouter 
    } from './routes';

import {
    EntityManager,
    EntityRepository,
    MikroORM,
    RequestContext,
    } from "@mikro-orm/core";
    
import passport from "passport";
import './passport-config';
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";
import expressSession from "express-session";
// import { errorHandler } from "./middleware/errorHandler.middleware";
// import { Auth } from './middleware/auth.middleware';

const app = express();

dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.STRIPE_TEST_SECRET_KEY) {
    throw new Error('No STRIPE_TEST_SECRET_KEY provided');
}

const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY;

app.use(cors());

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

export const initializeORM = async () => {
    DI.orm = await MikroORM.init();
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
    DI.stripe = new Stripe(STRIPE_TEST_SECRET_KEY, {
        apiVersion: '2024-04-10',
    });
}

export const initializeServer = async () => {
    initializeORM();
    
    app.use(express.json());
    app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
    // app.use(errorHandler);
    app.use(expressSession({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));
    // app.use(Auth.prepareAuthentication);
    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/items", itemRouter);
    app.use("/users", userRouter);
    app.use("/categories", categoryRouter);

    DI.server = app.listen(4000, () => {
        console.log('Server running on port 4000');
        }
    );
}

initializeServer();