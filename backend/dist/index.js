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
exports.initializeServer = exports.DI = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const item_1 = require("./entities/item");
const itemRouter_1 = require("./routes/itemRouter");
const core_1 = require("@mikro-orm/core");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
exports.DI = {};
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.DI.orm = yield core_1.MikroORM.init();
    exports.DI.em = exports.DI.orm.em;
    exports.DI.itemRepository = exports.DI.orm.em.getRepository(item_1.Item);
    app.use(express_1.default.json());
    app.use((req, res, next) => core_1.RequestContext.create(exports.DI.orm.em, next));
    app.use("/item", itemRouter_1.itemRouter);
    // app.use("/user", userRouter);
    exports.DI.server = app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
});
exports.initializeServer = initializeServer;
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
(0, exports.initializeServer)();
