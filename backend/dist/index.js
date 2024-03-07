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
exports.initializeServer = exports.initializeORM = exports.DI = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const entities_1 = require("./entities");
const routes_1 = require("./routes");
const core_1 = require("@mikro-orm/core");
const passport_1 = __importDefault(require("passport"));
require("./passport-config");
// import { Auth } from './middleware/auth.middleware';
const app = (0, express_1.default)();
// import passport from './passport-config';
app.use((0, cors_1.default)());
exports.DI = {};
const initializeORM = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.DI.orm = yield core_1.MikroORM.init();
    exports.DI.em = exports.DI.orm.em;
    exports.DI.itemRepository = exports.DI.orm.em.getRepository(entities_1.Item);
    exports.DI.userRepository = exports.DI.orm.em.getRepository(entities_1.User);
});
exports.initializeORM = initializeORM;
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.initializeORM)();
    app.use(express_1.default.json());
    app.use((req, res, next) => core_1.RequestContext.create(exports.DI.orm.em, next));
    // app.use(Auth.prepareAuthentication);
    app.use(passport_1.default.initialize());
    app.use("/item", routes_1.itemRouter);
    app.use("/user", routes_1.userRouter);
    exports.DI.server = app.listen(4000, () => {
        console.log('Server running on port 4000');
    });
});
exports.initializeServer = initializeServer;
(0, exports.initializeServer)();
