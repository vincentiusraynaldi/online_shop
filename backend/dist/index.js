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
const entity_1 = require("./entity");
const routes_1 = require("./routes");
const core_1 = require("@mikro-orm/core");
const passport_1 = __importDefault(require("passport"));
require("./passport-config");
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
// import { Auth } from './middleware/auth.middleware';
const app = (0, express_1.default)();
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
if (!process.env.STRIPE_TEST_SECRET_KEY) {
    throw new Error('No STRIPE_TEST_SECRET_KEY provided');
}
const STRIPE_TEST_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY;
app.use((0, cors_1.default)());
exports.DI = {};
const initializeORM = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.DI.orm = yield core_1.MikroORM.init();
    exports.DI.em = exports.DI.orm.em;
    exports.DI.itemRepository = exports.DI.orm.em.getRepository(entity_1.Item);
    exports.DI.userRepository = exports.DI.orm.em.getRepository(entity_1.User);
    exports.DI.orderRepository = exports.DI.orm.em.getRepository(entity_1.Order);
    exports.DI.categoryRepository = exports.DI.orm.em.getRepository(entity_1.Category);
    exports.DI.cartRepository = exports.DI.orm.em.getRepository(entity_1.Cart);
    exports.DI.wishlistRepository = exports.DI.orm.em.getRepository(entity_1.Wishlist);
    exports.DI.addressRepository = exports.DI.orm.em.getRepository(entity_1.Address);
    exports.DI.cartItemRepository = exports.DI.orm.em.getRepository(entity_1.CartItem);
    exports.DI.orderItemRepository = exports.DI.orm.em.getRepository(entity_1.OrderItem);
    exports.DI.stripe = new stripe_1.default(STRIPE_TEST_SECRET_KEY, {
        apiVersion: '2024-04-10',
    });
});
exports.initializeORM = initializeORM;
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.initializeORM)();
    app.use(express_1.default.json());
    app.use((req, res, next) => core_1.RequestContext.create(exports.DI.orm.em, next));
    app.use((0, express_session_1.default)({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));
    // app.use(Auth.prepareAuthentication);
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use("/item", routes_1.itemRouter);
    app.use("/user", routes_1.userRouter);
    app.use("/category", routes_1.categoryRouter);
    exports.DI.server = app.listen(4000, () => {
        console.log('Server running on port 4000');
    });
});
exports.initializeServer = initializeServer;
(0, exports.initializeServer)();
