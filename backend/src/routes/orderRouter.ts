import { Router } from "express";
import { DI } from "..";
import passport from "passport";
import { orderController } from "../controller/orderController";

const router = Router({mergeParams: true});

const authenticateJWT = passport.authenticate("jwt", {session: false});

// show all orders
router.get("/", authenticateJWT, orderController.getOrders);

// show order by id
router.get("/:id", authenticateJWT, orderController.getOrder);

export const orderRouter = router;