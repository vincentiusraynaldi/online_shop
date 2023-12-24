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
const _1 = require("./");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const JWT_SECRET = process.env.token;
const jwtOptions = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromHeader('Authorization')
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (JwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield _1.DI.userRepository.findOne({ id: JwtPayload.id });
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        return done(error, false);
    }
})));
module.exports = passport_1.default;
