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
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const JWT_SECRET = process.env.token;
console.log("jwt secret: ", JWT_SECRET);
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield _1.DI.userRepository.findOne(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (err) {
        return done(err, false);
    }
})));
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID as string,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
//     scope: ['email', 'profile']
// }, async (accessToken, refreshToken, profile: Profile, done: VerifiedCallback) => {
// if(profile)
// {
//     console.log("profile: ", profile);
//     const user = await DI.userRepository.findOne({ email: profile.emails![0].value });
//     if(user)
//     {
//         done(null, user);
//     } else {
//         const newUser = new User({
//             email: profile.emails![0].value,
//             firstName: profile.name!.givenName,
//             lastName: profile.name!.familyName,
//         });
//         await DI.userRepository.persistAndFlush(newUser);
//         done(null, newUser);
//     }
// }
// }));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _1.DI.userRepository.findOne({ id });
    if (user) {
        done(null, user);
    }
    else {
        done(null, false);
    }
}));
module.exports = passport_1.default;
