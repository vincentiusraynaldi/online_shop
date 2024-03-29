import express from "express";
import cors from "cors";
import http from "http";
import { 
    Item, 
    User, 
    Order,
    Category
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
// import { Auth } from './middleware/auth.middleware';

const app = express();

app.use(cors());

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    itemRepository: EntityRepository<Item>;
    userRepository: EntityRepository<User>;
    orderRepository: EntityRepository<Order>;
    categoryRepository: EntityRepository<Category>;
}

export const initializeORM = async () => {
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.itemRepository = DI.orm.em.getRepository(Item);
    DI.userRepository = DI.orm.em.getRepository(User);
}

export const initializeServer = async () => {
    initializeORM();
    
    app.use(express.json());
    app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
    // app.use(Auth.prepareAuthentication);
    app.use(passport.initialize());
    
    app.use("/item", itemRouter);
    app.use("/user", userRouter);
    app.use("/category", categoryRouter);

    DI.server = app.listen(4000, () => {
        console.log('Server running on port 4000');
        }
    );
}

initializeServer();