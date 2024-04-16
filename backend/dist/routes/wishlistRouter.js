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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistRouter = void 0;
const express_1 = require("express");
const __1 = require("../");
const entity_1 = require("../entity");
const router = (0, express_1.Router)({ mergeParams: true });
// add wishlist
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield entity_1.CreateWishlistSchema.validate(req.body).catch((err) => { res.status(400).send({ error: err.errors }); });
        if (!validatedData)
            return;
        const existingWishlist = yield __1.DI.wishlistRepository.findOne({
            wishlistName: validatedData.wishlistName
        });
        if (existingWishlist)
            return res.status(400).send({ message: "Wishlist already exists" });
        const newWishlist = yield __1.DI.wishlistRepository.persistAndFlush(validatedData);
        return res.status(201).json(newWishlist);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// show all wishlist
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlist = yield __1.DI.wishlistRepository.findAll();
        res.send(wishlist);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// show all items in wishlist by id
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlist = yield __1.DI.wishlistRepository.findOne({ id: req.params.id });
        if (!wishlist)
            return res.status(404).send({ message: "Wishlist not found" });
        res.send(wishlist.items);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// update wishlist (change name)
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlist = yield __1.DI.wishlistRepository.findOne({ id: req.params.id });
        if (!wishlist)
            return res.status(404).send({ message: "Wishlist not found" });
        Object.assign(wishlist, req.body);
        yield __1.DI.wishlistRepository.flush();
        return res.status(200).json(wishlist);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// delete wishlist
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlist = yield __1.DI.wishlistRepository.findOne({ id: req.params.id });
        if (!wishlist)
            return res.status(404).send({ message: "Wishlist not found" });
        yield __1.DI.wishlistRepository.removeAndFlush(wishlist);
        return res.status(200).send({ message: "Wishlist deleted" });
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// delete item in wishlist
router.delete("/:id/:itemId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlist = yield __1.DI.wishlistRepository.findOne({ id: req.params.id });
        if (!wishlist)
            return res.status(404).send({ message: "Wishlist not found" });
        const item = yield __1.DI.itemRepository.findOne({ id: req.params.itemId });
        if (!item)
            return res.status(404).send({ message: "Item not found" });
        // check if item is in wishlist
        if (!wishlist.items.contains(item))
            return res.status(404).send({ message: "Item not in wishlist" });
        wishlist.items.remove(item);
        yield __1.DI.wishlistRepository.flush();
        return res.status(200).send({ message: "Item removed from wishlist" });
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
exports.wishlistRouter = router;
