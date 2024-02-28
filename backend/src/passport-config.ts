import { DI } from "./";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    scope: ['email', 'profile']
}, async (accessToken, refreshToken, profile: Profile, done) => {
    try {
        const existingUser = await DI.userRepository.findOne({ email: profile.emails[0].value });
        if (existingUser) {
            return done(null, existingUser);
        } else {
            const newUser = await DI.userRepository.persistAndFlush({
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
            });
            return done(null, newUser);
        }
    } catch (err: any) {
        return done(err, null);
    }
}));

module.exports = passport;