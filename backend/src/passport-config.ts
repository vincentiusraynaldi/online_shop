import { DI } from "./";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
// import { User } from "./entities";
import { UseRequestContext } from "@mikro-orm/core";
import { VerifiedCallback } from "passport-jwt";
import { RegisterGoogleUserDTO } from "./dto";
import { UserMapper } from "./mapper";

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const JWT_SECRET = process.env.JWT_SECRET as string;

console.log("jwt secret: ", JWT_SECRET);

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await DI.userRepository.findOne(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_REDIRECT_URI as string,
    scope: ['email', 'profile']
}, async (accessToken, refreshToken, profile: Profile, done: VerifiedCallback) => {
    if(profile)
    {
        console.log("profile: ", profile);
        const user = await DI.userRepository.findOne({ email: profile.emails![0].value });
        if(user)
        {
            done(null, user);
        } else {
            const newUserDTO: RegisterGoogleUserDTO = {
                email: profile.emails![0].value,
                firstName: profile.name!.givenName!,
                lastName: profile.name!.familyName!,
                googleId: profile.id
            };
            const newUser = UserMapper.createUserFromRegisterGoogleUserDTO(newUserDTO);
            await DI.userRepository.persistAndFlush(newUser);
            done(null, newUser);
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (id: string, done) => {
    const user = await DI.userRepository.findOne({ id });
    if(user)
    {
        done(null, user);
    } else {
        done(null, false);
    }
});

module.exports = passport;