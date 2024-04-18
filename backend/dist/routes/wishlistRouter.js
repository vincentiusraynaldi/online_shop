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
exports.wishlistRouter = void 0;
const express_1 = require("express");
const __1 = require("../");
const entity_1 = require("../entity");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)({ mergeParams: true });
// add wishlist
router.post("/", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield entity_1.CreateWishlistSchema.validate(req.body).catch((err) => { res.status(400).send({ error: err.errors }); });
        if (!validatedData)
            return;
        // const existingWishlist = await DI.wishlistRepository.findOne({
        //     wishlistName: validatedData.wishlistName
        // });
        // if (existingWishlist) return res.status(400).send({ message: "Wishlist already exists" });
        // const newWishlist = await DI.wishlistRepository.persistAndFlush(validatedData);
        // return res.status(201).json(newWishlist);
        const user = req.user;
        const wishlist = new entity_1.Wishlist(req.body);
        // const wishlist = DI.wishlistRepository.create(req.body);
        user.wishlists.add(wishlist);
        yield __1.DI.userRepository.flush();
        return res.status(201).json(wishlist);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// show all wishlist
router.get("/", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield user.wishlists.init();
        res.send(user.wishlists.getItems());
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// show all items in wishlist by id
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield user.wishlists.init();
        const wishlist = user.wishlists.getItems().find((wishlist) => wishlist.id === req.params.id);
        if (!wishlist)
            return res.status(404).send({ message: "Wishlist not found" });
        yield wishlist.items.init();
        console.log(wishlist.items);
        res.send(wishlist.items);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// update wishlist (change name)
router.put("/:id", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield user.wishlists.init();
        const wishlist = user.wishlists.getItems().find((wishlist) => wishlist.id === req.params.id);
        if (!wishlist)
            return res.status(404).send({ message: "Wishlist not found" });
        Object.assign(wishlist, req.body);
        yield __1.DI.userRepository.flush();
        return res.status(200).json(wishlist);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// delete wishlist
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield user.wishlists.init();
        const wishlist = user.wishlists.getItems().find((wishlist) => wishlist.id === req.params.id);
        if (!wishlist)
            return res.status(404).send({ message: "Wishlist not found" });
        yield __1.DI.userRepository.flush();
        yield __1.DI.wishlistRepository.removeAndFlush(wishlist);
        return res.status(200).send({ message: "Wishlist deleted" });
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// delete item in wishlist
router.delete("/:id/:itemId", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const wishlist = await DI.wishlistRepository.findOne({ id: req.params.id });
        const user = req.user;
        yield user.wishlists.init();
        const wishlist = user.wishlists.getItems().find((wishlist) => wishlist.id === req.params.id);
        if (!wishlist)
            return res.status(404).send({ message: "Wishlist not found" });
        const item = yield __1.DI.itemRepository.findOne({ id: req.params.itemId });
        if (!item)
            return res.status(404).send({ message: "Item not found" });
        yield wishlist.items.init();
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
// add item to wishlist
router.post('/:wishlistId/:itemId', passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        console.log(user);
        const item = yield __1.DI.itemRepository.findOne({ id: req.params.itemId });
        yield user.wishlists.init();
        const wishlist = user.wishlists.getItems().find((wishlist) => wishlist.id === req.params.wishlistId);
        if (!item)
            return res.status(404).send({ message: 'Item not found' });
        if (!wishlist)
            return res.status(404).send({ message: 'Wishlist not found' });
        yield wishlist.items.init();
        //check if item is already in wishlist
        if (wishlist.items.contains(item))
            return res.status(400).send({ message: 'Item already in wishlist' });
        wishlist.items.add(item);
        wishlist.user = user;
        yield __1.DI.userRepository.flush();
        res.send(wishlist);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
exports.wishlistRouter = router;
