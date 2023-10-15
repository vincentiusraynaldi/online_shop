import express from 'express';
import cors from 'cors';
import http from "http";
import { Item, User } from "./entities/";
import { itemRouter } from './routes/itemRouter';
import { userRouter } from './routes/userRouter';
import {
    EntityManager,
    EntityRepository,
    MikroORM,
    RequestContext,
    } from "@mikro-orm/core";

const app = express();

app.use(cors());

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    itemRepository: EntityRepository<Item>;
    userRepository: EntityRepository<User>;
}

export const initializeServer = async () => {
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.itemRepository = DI.orm.em.getRepository(Item);
    
    app.use(express.json());
    app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
    
    app.use("/item", itemRouter);
    app.use("/user", userRouter);

    DI.server = app.listen(3000, () => {
        console.log('Server running on port 3000');
        }
    );
}

initializeServer();
