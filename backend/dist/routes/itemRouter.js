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
const router = (0, express_1.Router)({ mergeParams: true });
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const items = await DI.itemRepository.findAll();
    // res.send(items);
    res.send('masuk item router');
}));
router.get('/masuk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('masuk item router');
}));
exports.itemRouter = router;
