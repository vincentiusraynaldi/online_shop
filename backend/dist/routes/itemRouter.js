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
exports.itemRouter = void 0;
const express_1 = require("express");
const __1 = require("../");
const entity_1 = require("../entity");
const mapper_1 = require("../mapper");
const router = (0, express_1.Router)({ mergeParams: true });
//get all item
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield __1.DI.itemRepository.findAll();
    res.send(items);
}));
//add an item
router.post('/newItem', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield entity_1.CreateItemSchema.validate(req.body).catch((err) => { res.status(400).send({ error: err.errors }); });
        if (!validatedData)
            return;
        const CreateItemDTO = Object.assign(Object.assign({}, validatedData), { categories: req.body.categories || [] });
        const existingItem = yield __1.DI.itemRepository.findOne({
            itemName: CreateItemDTO.itemName
        });
        if (existingItem)
            return res.status(400).send({ message: 'Item already exists' });
        const newItem = mapper_1.itemMapper.createItemFromDTO(CreateItemDTO);
        yield __1.DI.itemRepository.persistAndFlush(newItem);
        return res.status(201).json(newItem);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
//edit item
router.put('/edit/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingItem = yield __1.DI.itemRepository.findOne({ id: req.params.id });
        if (!existingItem)
            return res.status(404).send({ message: 'Item not found' });
        Object.assign(existingItem, req.body);
        yield __1.DI.itemRepository.flush();
        return res.status(200).json(existingItem);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
//get item by id
router.get('/id/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield __1.DI.itemRepository.findOne({ id: req.params.id });
        res.send(item);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// get items by name
router.get('/name/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchPattern = new RegExp(req.params.name, 'i'); // 'i' for case-insensitive search
        const items = yield __1.DI.itemRepository.find({ itemName: searchPattern });
        res.send(items);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// get items by category
// todo: must check if the user wanted to show items from multiple categories
// !! check if query will be joined or seperated (items from all categories or items from each category)
router.get('/category/:category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = req.params.category.split(','); // Split the category parameter into an array of categories
        const categoryEntity = yield __1.DI.categoryRepository.find({ categoryName: { $in: categories } });
        const items = yield __1.DI.itemRepository.find(categoryEntity, { populate: ['categories'] });
        res.send(items);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// add item to category
router.put('/addCategory/:itemId/:categoryId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield __1.DI.itemRepository.findOne({ id: req.params.itemId });
        const category = yield __1.DI.categoryRepository.findOne({ id: req.params.categoryId });
        if (!item || !category)
            return res.status(404).send({ message: 'Item or Category not found' });
        item.categories.add(category);
        yield __1.DI.itemRepository.flush();
        res.send(item);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// add item to cart
router.post("/addToCart/:itemId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingItem = yield __1.DI.itemRepository.findOne(req.params.itemId);
        if (!existingItem)
            return res.status(404).send({ message: "Item not found" });
        const user = req.user;
        //add item in cart if there is no such item in cart
        if (!user.cart.has(existingItem)) {
            user.cart.set(existingItem, 1);
            yield __1.DI.userRepository.flush();
        }
        else { // add item quantity if there is already such item in cart
            user.cart.set(existingItem, user.cart.get(existingItem) + req.body.quantity);
            yield __1.DI.userRepository.flush();
        }
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
exports.itemRouter = router;
