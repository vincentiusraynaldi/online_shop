import express from 'express';
import cors from 'cors';
import http from "http";
import { Item, User } from "./entities";
import { itemRouter } from './routes/itemRouter';
import { userRouter } from './routes/userRouter';
import {
    EntityManager,
    EntityRepository,
    MikroORM,
    RequestContext,
    } from "@mikro-orm/core";
import { Auth } from './middleware/auth.middleware';

const app = express();

app.use(cors());

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    itemRepository: EntityRepository<Item>;
    userRepository: EntityRepository<User>;
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

    DI.server = app.listen(3000, () => {
        console.log('Server running on port 3000');
        }
    );
}

initializeServer();
