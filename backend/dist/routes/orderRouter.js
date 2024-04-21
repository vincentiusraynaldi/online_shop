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
exports.orderRouter = void 0;
const express_1 = require("express");
const __1 = require("../");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)({ mergeParams: true });
// show all orders
router.get("/", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.DI.userRepository.findOne({ id: req.user.id }, { populate: ["orders.items", "orders.address"] });
        if (!user)
            return res.status(404).send({ message: "User not found" });
        const orders = user.orders;
        res.status(200).send(orders);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// show order by id
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield __1.DI.userRepository.findOne({ id: req.user.id }, { populate: ["orders.items", "orders.address"] });
        if (!user)
            return res.status(404).send({ message: "User not found" });
        const order = user.orders.getItems().find((order) => order.id === req.params.id);
        if (!order)
            return res.status(404).send({ message: "Order not found" });
        res.status(200).send(order);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
exports.orderRouter = router;
