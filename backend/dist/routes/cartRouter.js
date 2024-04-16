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
// select item in cart
// delete item in cart
router.delete("/deleteItem/:id", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        user.cart.items.getItems().forEach((cartItem) => {
            // if the item is in the cart and the quantity is greater than the quantity to be deleted, subtract the quantity
            if (cartItem.item.id === req.params.id && cartItem.quantity > req.body.quantity) {
                cartItem.quantity -= req.body.quantity;
                // if the item is in the cart and the quantity is less than the quantity to be deleted, remove the item
            }
            else if (cartItem.item.id === req.params.id && cartItem.quantity <= req.body.quantity) {
                user.cart.items.remove(cartItem);
            }
        });
        yield __1.DI.userRepository.flush();
        res.send(user.cart.items.getItems());
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// checkout selected item in cart
// todo needs to check if it is right since it is only from copilot
router.post("/checkout", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let total = 0;
        user.cart.items.getItems().forEach((cartItem) => {
            total += cartItem.item.itemPrice * cartItem.quantity;
        });
        const order = new entity_1.Order(total);
        order.items = user.cart.items.getItems();
        order.address = user.address;
        order.totalPrice = total;
        user.orders.add(order);
        user.cart.items.removeAll();
        yield __1.DI.userRepository.flush();
        res.send({ message: "Checkout successful", total });
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
