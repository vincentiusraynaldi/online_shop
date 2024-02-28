import express from "express";
import cors from "cors";
import http from "http";
import { 
    Item, 
    User, 
    Order
    } from "./entities";

import { 
    itemRouter, 
    userRouter 
    } from './routes';
    
import {
    EntityManager,
    EntityRepository,
    MikroORM,
    RequestContext,
    } from "@mikro-orm/core";
import { Auth } from './middleware/auth.middleware';

const app = express();

// import passport from './passport-config';

app.use(cors());

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    itemRepository: EntityRepository<Item>;
    userRepository: EntityRepository<User>;
    orderRepository: EntityRepository<Order>;
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
    app.use(Auth.prepareAuthentication);
    
    app.use("/item", itemRouter);
    app.use("/user", userRouter);

    DI.server = app.listen(4000, () => {
        console.log('Server running on port 4000');
        }
    );
}

initializeServer();