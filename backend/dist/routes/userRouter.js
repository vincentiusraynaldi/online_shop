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
exports.userRouter = void 0;
const express_1 = require("express");
const __1 = require("../");
const entity_1 = require("../entity");
const userMapper_1 = require("../mapper/userMapper");
const auth_middleware_1 = require("../middleware/auth.middleware");
const passport_1 = __importDefault(require("passport"));
//todo: cart and wishlist routes from index.ts doesnt work, idk why
// import { 
//     wishlistRouter,
//     cartRouter
// } from "./";
const cartRouter_1 = require("./cartRouter");
const wishlistRouter_1 = require("./wishlistRouter");
const addressRouter_1 = require("./addressRouter");
const orderRouter_1 = require("./orderRouter");
const router = (0, express_1.Router)({ mergeParams: true });
//register new user 
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield entity_1.RegisterUserSchema.validate(req.body).catch((err) => {
            res.status(400).json({ error: err.errors });
        });
        if (!validatedData) {
            return;
        }
        const RegisterUserDTO = Object.assign(Object.assign({}, validatedData), { email: validatedData.email.toLowerCase(), 
            //todo: make the password have password best practices
            //(uppercase, lowercase, number, special character, length)
            password: yield auth_middleware_1.Auth.hashPassword(validatedData.password) });
        // const password = await Auth.hashPassword(validatedData.password);
        //check if email already exist
        const existingUser = yield __1.DI.userRepository.findOne({
            email: req.body.email.toLowerCase()
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        // const newUser = new User(RegisterUserDTO.email, RegisterUserDTO.firstName, RegisterUserDTO.lastName, RegisterUserDTO.password);
        const newUser = userMapper_1.UserMapper.createUserFromRegisterUserDTO(RegisterUserDTO);
        yield __1.DI.userRepository.persistAndFlush(newUser);
        return res.status(201).json(newUser);
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
}));
//login new user using jwt
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if the email and password are valid
        const validatedData = yield entity_1.LoginUserSchema.validate(req.body).catch((err) => {
            res.status(400).json({ error: err.errors });
        });
        if (!validatedData) {
            return;
        }
        //check if the user exist
        const existingUser = yield __1.DI.userRepository.findOne({
            email: validatedData.email.toLowerCase()
        });
        if (!existingUser) {
            return res.status(400).json({ error: "Email not found" });
        }
        //check if there is password for the user
        if (!existingUser.password) {
            return res.status(400).json({ error: "Invalid password" });
        }
        //check if the password is correct
        const validPassword = yield auth_middleware_1.Auth.comparePasswordwithHash(validatedData.password, existingUser.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }
        //generate token
        const token = auth_middleware_1.Auth.generateToken({
            id: existingUser.id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
        });
        if (token) {
            return res.status(200).json({ accessToken: token, id: existingUser.id });
        }
        else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
}));
//login with google
router.get('/google', passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
//google callback
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const token = auth_middleware_1.Auth.generateToken({
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
    });
    console.log("token: ", token);
    console.log("req.user: ", req.user);
    //todo change the redirect to the home page of frontend
    // res.redirect(`http://localhost:4000?token=${token}`);
});
//logout user
router.get("/logout", (req, res) => {
    req.logout(() => { });
    return res.status(200).json({ message: "Logged out" });
});
// edit profile
router.put("/edit/:id", passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const exitstingUser = yield __1.DI.userRepository.findOne(id);
        if (!exitstingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) === (exitstingUser === null || exitstingUser === void 0 ? void 0 : exitstingUser.email)) {
            req.body.password = yield auth_middleware_1.Auth.hashPassword(req.body.password);
            Object.assign(exitstingUser, req.body);
            yield __1.DI.userRepository.flush();
            return res.status(200).json(exitstingUser);
        }
        else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
}));
//get user profile
router.get("/profile/:id", passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = req.params.id;
        const exitstingUser = yield __1.DI.userRepository.findOne(id);
        if (!exitstingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.email) === (exitstingUser === null || exitstingUser === void 0 ? void 0 : exitstingUser.email)) {
            return res.status(200).json(exitstingUser);
        }
        else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
}));
// get order info
//todo check if correct
router.get('/orders/:orderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const id = req.params.orderId;
        const order = yield __1.DI.orderRepository.findOne(id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) === order.user.id) {
            return res.status(200).json(order);
        }
        else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
}));
// !!
// !! cart routes !!
// !!
router.use("/cart", cartRouter_1.cartRouter);
// !!
// !! wishlist routes !!
// !!
router.use("/wishlist", wishlistRouter_1.wishlistRouter);
// !!
// !! address routes !!
// !!
router.use("/address", addressRouter_1.addressRouter);
// !!
// !! order routes !!
// !!
router.use("/order", orderRouter_1.orderRouter);
exports.userRouter = router;
