import { Router } from "express";
import { DI } from "../";
import passport from "passport";

const router = Router({mergeParams: true});

// show all orders
router.get("/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const user = await DI.userRepository.findOne({ id: req.user.id },{ populate: ["orders.items", "orders.address"] });
        
        if (!user) return res.status(404).send({ message: "User not found" });

        const orders = user.orders;

        res.status(200).send(orders);
    }
    catch(e:any){
        return res.status(400).send({ message: e.message });
    }
});

// show order by id
router.get("/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const user = await DI.userRepository.findOne({ id: req.user.id },{ populate: ["orders.items", "orders.address"] });
        
        if (!user) return res.status(404).send({ message: "User not found" });

        const order = user.orders.getItems().find((order) => order.id === req.params.id);

        if (!order) return res.status(404).send({ message: "Order not found" });

        res.status(200).send(order);
    }
    catch(e:any){
        return res.status(400).send({ message: e.message });
    }
});

export const orderRouter = router;