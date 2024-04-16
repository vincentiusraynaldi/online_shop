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
exports.categoryRouter = void 0;
const express_1 = require("express");
const __1 = require("../");
const entity_1 = require("../entity");
const router = (0, express_1.Router)({ mergeParams: true });
// get all categories
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield __1.DI.categoryRepository.findAll();
    res.send(categories);
}));
// get category by id
router.get("/id/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield __1.DI.categoryRepository.findOne({ id: req.params.id });
    if (!category)
        return res.status(404).send({ message: "Category not found" });
    res.send(category);
}));
// add a category
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.categoryName)
            return res.status(400).send({ message: 'Category name is required' });
        if (yield __1.DI.categoryRepository.findOne({ categoryName: req.body.categoryName }))
            return res.status(400).send({ message: "Category already exists" });
        const category = new entity_1.Category(req.body.categoryName);
        yield __1.DI.categoryRepository.persistAndFlush(category);
        return res.status(201).json(category);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// delete category
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield __1.DI.categoryRepository.findOne({ id: req.params.id });
        if (!category)
            return res.status(404).send({ message: "Category not found" });
        yield __1.DI.categoryRepository.removeAndFlush(category);
        return res.status(200).send({ message: "Category deleted" });
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
exports.categoryRouter = router;
