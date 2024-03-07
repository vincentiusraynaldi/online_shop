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
const entities_1 = require("../entities");
const auth_middleware_1 = require("../middleware/auth.middleware");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)({ mergeParams: true });
//register new user 
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield entities_1.RegisterUserSchema.validate(req.body).catch((err) => {
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
        const newUser = new entities_1.User(RegisterUserDTO);
        yield __1.DI.userRepository.persistAndFlush(newUser);
        return res.status(201).json({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            address: newUser.address,
        });
    }
    catch (e) {
        return res.status(400).json({ message: e.message });
    }
}));
//login new user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if the email and password are valid
        const validatedData = yield entities_1.LoginUserSchema.validate(req.body).catch((err) => {
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
// edit profile
// router.put("/edit/:id", Auth.verifyAccess, async (req, res) => {
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
// router.get("/profile/:id", Auth.verifyAccess, async (req, res) => {
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
//logout user
// !!
// !! cart routes !!
// !!
// !!
// !! wishlist routes !!
// !!
exports.userRouter = router;
