import { Router } from "express";
import { DI } from "../";
import passport from "passport";
import { CartItem, Item, Order } from "../entity";

const router = Router({mergeParams: true});

// select item in cart

// delete item in cart
router.delete("/deleteItem/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const user = req.user;
        user.cart.items.getItems().forEach((cartItem: CartItem) => {
            // if the item is in the cart and the quantity is greater than the quantity to be deleted, subtract the quantity
            if (cartItem.item.id === req.params.id && cartItem.quantity > req.body.quantity) {
                cartItem.quantity -= req.body.quantity;
            // if the item is in the cart and the quantity is less than the quantity to be deleted, remove the item
            }else if (cartItem.item.id === req.params.id && cartItem.quantity <= req.body.quantity) {
                user.cart.items.remove(cartItem);
            }
        });
        await DI.userRepository.flush();
        res.send(user.cart.items.getItems());
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

// checkout selected item in cart
// todo needs to check if it is right since it is only from copilot
router.post("/checkout", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const user = req.user;
        let total = 0;
        user.cart.items.getItems().forEach((cartItem: CartItem) => {
            total += cartItem.item.itemPrice * cartItem.quantity;
        });

        const order = new Order(total);
        order.items = user.cart.items.getItems();
        order.address = user.address;
        order.totalPrice = total;
        user.orders.add(order);
        
        user.cart.items.removeAll();
        await DI.userRepository.flush();
        res.send({message: "Checkout successful", total});
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

// test stripe
router.post("/stripe", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const charge = await DI.stripe.charges.create({
            amount: 1000,
            currency: "usd",
            source: "tok_visa",
            description: 'Charge for ' + req.body.amount +' amount',
        });
        // Process the charge and handle the response as needed
        console.log(charge);
        res.status(200).send({ message: "Payment successful", charge });
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

export const cartRouter = router;