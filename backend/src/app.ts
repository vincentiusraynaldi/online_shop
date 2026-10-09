import express from "express";
import cors from "cors";
import passport from "passport";
import './passport-config';
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";
import expressSession from "express-session";
import { OAuth2Client } from "google-auth-library";
import { RequestContext } from "@mikro-orm/core";

import { itemRouter, userRouter, categoryRouter } from './routes';
import { DI } from "./di";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

dotenv.config({ path: path.join(__dirname, '../.env.backend') });

if (!process.env.STRIPE_TEST_SECRET_KEY) {
    throw new Error('No STRIPE_TEST_SECRET_KEY provided');
}
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('No GOOGLE_CLIENT_ID provided');
}

export const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const envGoogleClientId = process.env.GOOGLE_CLIENT_ID;

DI.stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY, {
    apiVersion: '2024-04-10',
});

export const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/items", itemRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);

// ...after app = express()
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// optional: raw JSON spec
app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));