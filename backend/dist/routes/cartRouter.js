"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const __1 = require("../");
const passport_1 = __importDefault(require("passport"));
const entity_1 = require("../entity");
const router = (0, express_1.Router)({ mergeParams: true });
// show all items in cart
router.get("/", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.DI.userRepository.findOne({ id: req.user.id }, { populate: ["cart.items"] });
        if (!user)
            return res.status(404).send({ message: "User not found" });
        const cart = user.cart;
        res.send(cart);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// select item in cart
// add item to cart
router.post("/:itemId", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingItem = yield __1.DI.itemRepository.findOne(req.params.itemId);
        if (!existingItem)
            return res.status(404).send({ message: "Item not found" });
        const user = yield __1.DI.userRepository.findOne({ id: req.user.id }, { populate: ["cart.items"] });
        // check if item price is a number
        if (isNaN(req.body.quantity))
            return res.status(400).send({ message: "Quantity must be a number" });
        // const cart = await DI.cartRepository.findOne({ id: user.cart.id });
        if (!user)
            return res.status(404).send({ message: "User not found" });
        const cart = user.cart;
        const items = cart.items;
        // if the item is not in the cart, add the item
        if (!items.getItems().find((cartItem) => cartItem.item.id === req.params.itemId)) {
            const cartItem = new entity_1.CartItem(existingItem, req.body.quantity);
            items.add(cartItem);
            cart.totalPrice += existingItem.itemPrice * Number(req.body.quantity);
        }
        else {
            // if the item is in the cart, add the quantity
            items.getItems().forEach((cartItem) => {
                if (cartItem.item.id === req.params.itemId) {
                    cartItem.quantity += Number(req.body.quantity);
                    cart.totalPrice += existingItem.itemPrice * Number(req.body.quantity);
                }
            });
        }
        yield __1.DI.userRepository.flush();
        res.send(user.cart);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// delete item in cart
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.DI.userRepository.findOne({ id: req.user.id }, { populate: ["cart.items.item"] });
        if (!user)
            return res.status(404).send({ message: "User not found" });
        // check if item price is a number
        if (isNaN(req.body.quantity))
            return res.status(400).send({ message: "Quantity must be a number" });
        user.cart.items.getItems().forEach((cartItem) => {
            // if the item is in the cart and the quantity is greater than the quantity to be deleted, subtract the quantity
            if (cartItem.item.id === req.params.id && cartItem.quantity > req.body.quantity) {
                cartItem.quantity -= Number(req.body.quantity);
                user.cart.totalPrice -= Number(cartItem.item.itemPrice) * Number(req.body.quantity);
                // if the item is in the cart and the quantity is less than the quantity to be deleted, remove the item
            }
            else if (cartItem.item.id === req.params.id && cartItem.quantity <= req.body.quantity) {
                user.cart.items.remove(cartItem);
                user.cart.totalPrice -= cartItem.item.itemPrice * cartItem.quantity;
            }
        });
        // res.status(200).send(user.cart);
        yield __1.DI.userRepository.flush();
        res.status(200).json(user.cart);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// checkout selected item in cart
// todo needs to check if it is right since it is only from copilot
router.post("/checkout", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.DI.userRepository.findOne({ id: req.user.id }, { populate: ["cart.items"] });
        if (!user)
            return res.status(404).send({ message: "User not found" });
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
        yield __1.DI.userRepository.flush();
        // res.send({message: "Checkout successful", total});
        res.status(200).send(user);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// test stripe
router.post("/stripe", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const charge = yield __1.DI.stripe.charges.create({
            amount: 1000,
            currency: "usd",
            source: "tok_visa",
            description: 'Charge for ' + req.body.amount + ' amount',
        });
        // Process the charge and handle the response as needed
        console.log(charge);
        res.status(200).send({ message: "Payment successful", charge });
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
exports.cartRouter = router;
