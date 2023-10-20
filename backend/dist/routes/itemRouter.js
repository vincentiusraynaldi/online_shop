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
const entities_1 = require("../entities");
const router = (0, express_1.Router)({ mergeParams: true });
//get all item
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield __1.DI.itemRepository.findAll();
    res.send(items);
}));
//add an item
router.post('/newItem', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield entities_1.CreateItemSchema.validate(req.body).catch((err) => { res.status(400).send({ error: err.errors }); });
        if (!validatedData)
            return;
        const CreateItemDTO = Object.assign({}, validatedData);
        const existingItem = yield __1.DI.itemRepository.findOne({
            itemName: CreateItemDTO.itemName
        });
        if (existingItem)
            return res.status(400).send({ message: 'Item already exists' });
        const newItem = new entities_1.Item(CreateItemDTO);
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
    const item = yield __1.DI.itemRepository.findOne({ id: req.params.id });
    res.send(item);
}));
// get items by name
router.get('/name/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchPattern = new RegExp(req.params.name, 'i'); // 'i' for case-insensitive search
    const items = yield __1.DI.itemRepository.find({ itemName: searchPattern });
    res.send(items);
}));
//get item by category
router.get('/category/:category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield __1.DI.itemRepository.find({ itemCategory: req.params.category });
    res.send(items);
}));
exports.itemRouter = router;
