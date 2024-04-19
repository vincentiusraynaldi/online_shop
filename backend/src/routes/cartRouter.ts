import { Router } from "express";
import { DI } from "../";
import passport from "passport";
import { CartItem, Item, Order, OrderItem } from "../entity";
import { Collection } from "@mikro-orm/core";

const router = Router({mergeParams: true});

// show all items in cart
router.get("/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const user = await DI.userRepository.findOne({ id: req.user.id },{ populate: ["cart.items"] });
        
        if (!user) return res.status(404).send({ message: "User not found" });

        const cart = user.cart;

        res.send(cart);
    }
    catch(e:any){
        return res.status(400).send({ message: e.message });
    }
});
// select item in cart

// add item to cart
router.post("/:itemId", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const existingItem = await DI.itemRepository.findOne(req.params.itemId);
        if (!existingItem) return res.status(404).send({ message: "Item not found" });

        const user = await DI.userRepository.findOne({ id: req.user.id },{ populate: ["cart.items"] });

        // check if item price is a number
        if (isNaN(req.body.quantity)) return res.status(400).send({ message: "Quantity must be a number" });

        // const cart = await DI.cartRepository.findOne({ id: user.cart.id });

        if (!user) return res.status(404).send({ message: "User not found" }); 
        const cart = user.cart;
        const items = cart.items;

        // if the item is not in the cart, add the item
        if (!items.getItems().find((cartItem: CartItem) => cartItem.item.id === req.params.itemId)) {
            const cartItem = new CartItem(existingItem, req.body.quantity);
            items.add(cartItem);
            cart.totalPrice += existingItem.itemPrice * Number(req.body.quantity);
        } else {
            // if the item is in the cart, add the quantity
            items.getItems().forEach((cartItem: CartItem) => {
                if (cartItem.item.id === req.params.itemId) {
                    cartItem.quantity += Number(req.body.quantity);
                    cart.totalPrice += existingItem.itemPrice * Number(req.body.quantity);
                }
            });
        }
        await DI.userRepository.flush();
        res.send(user.cart);
    }
    catch(e:any){
        return res.status(400).send({ message: e.message });
    }
});

// delete item in cart
router.delete("/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const user = await DI.userRepository.findOne({ id: req.user.id }, { populate: ["cart.items.item"] });

        if (!user) return res.status(404).send({ message: "User not found" });

        // check if item price is a number
        if (isNaN(req.body.quantity)) return res.status(400).send({ message: "Quantity must be a number" });
        
        user.cart.items.getItems().forEach((cartItem: CartItem) => {

            // if the item is in the cart and the quantity is greater than the quantity to be deleted, subtract the quantity
            if (cartItem.item.id === req.params.id && cartItem.quantity > req.body.quantity) {
                cartItem.quantity -= Number(req.body.quantity);
                user.cart.totalPrice -= Number(cartItem.item.itemPrice) * Number(req.body.quantity);

            // if the item is in the cart and the quantity is less than the quantity to be deleted, remove the item
            }else if (cartItem.item.id === req.params.id && cartItem.quantity <= req.body.quantity) {
                user.cart.items.remove(cartItem);
                user.cart.totalPrice -= cartItem.item.itemPrice * cartItem.quantity;
            }
        });
        
        // res.status(200).send(user.cart);
        await DI.userRepository.flush();
        res.status(200).json(user.cart);
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

// checkout selected item in cart
// todo needs to check if it is right since it is only from copilot
router.post("/checkout", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const user = await DI.userRepository.findOne({ id: req.user.id }, { populate: ["cart.items"] });

        if (!user) return res.status(404).send({ message: "User not found" });

        // let total = user.cart.totalPrice;
        // user.cart.items.getItems().forEach((cartItem: CartItem) => {
        //     total += cartItem.item.itemPrice * cartItem.quantity;
        // });

        // const order = new Order(total);
        // user.cart.items.getItems().forEach((cartItem: CartItem) => {
        //     order.items.add(new OrderItem(cartItem.item, cartItem.quantity));
        // });
        // // order.address = user.address;
        // // order.totalPrice = total;
        // user.orders.add(order);
        
        // user.cart.items.removeAll();
        // user.cart.totalPrice = 0;
        await DI.userRepository.flush();
        // res.send({message: "Checkout successful", total});
        res.status(200).send(user);
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