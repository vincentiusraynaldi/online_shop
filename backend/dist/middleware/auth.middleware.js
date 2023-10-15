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
exports.Auth = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const BCRYPT_SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_OPTIONS = {
    expiresIn: '1h',
    algorithm: 'HS256',
    issuer: 'https://localhost:3000',
};
const hashPassword = (password) => bcrypt_1.default.hash(password, BCRYPT_SALT);
const comparePasswordwithHash = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return bcrypt_1.default.compare(password, hash);
    }
    catch (_a) {
        return false;
    }
});
const generateToken = (payload) => {
    if (JWT_SECRET) {
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, JWT_OPTIONS);
    }
    else {
        return null;
    }
};
const verifyToken = (token) => {
    if (JWT_SECRET) {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    else {
        return null;
    }
};
const prepareAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const AuthHeader = req.get('Authorization');
    if (AuthHeader) {
        try {
            const token = verifyToken(AuthHeader);
            if (token) {
                req.user = yield index_1.DI.userRepository.findOne({ id: token.id });
                req.token = token;
            }
            else {
                req.user = null;
                req.token = null;
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        req.user = null;
        req.token = null;
    }
    next();
});
const verifyAccess = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    else {
        next();
    }
};
exports.Auth = {
    hashPassword,
    comparePasswordwithHash,
    generateToken,
    verifyToken,
    prepareAuthentication,
    verifyAccess,
};
