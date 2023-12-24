import { DI } from "./";
import  { VerifyCallback, ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import passport from "passport";


const JWT_SECRET = process.env.token;

const jwtOptions = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromHeader('Authorization')
};

passport.use(new JwtStrategy(jwtOptions, async (JwtPayload, done) => {
  try {
    const user = await DI.userRepository.findOne({ id: JwtPayload.id });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;