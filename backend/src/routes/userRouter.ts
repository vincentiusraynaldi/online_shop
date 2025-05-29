import { Router } from "express";
import passport from "passport";
//todo: cart and wishlist routes from index.ts doesnt work, idk why
// import { 
//     wishlistRouter,
//     cartRouter
// } from "./";
import { cartRouter } from "./cartRouter";
import { wishlistRouter } from "./wishlistRouter";
import { addressRouter } from "./addressRouter";
import { orderRouter } from "./orderRouter";

import { userController } from "../controller/userController";

const router = Router({mergeParams: true});

const authenticateJWT = passport.authenticate('jwt', { session: false });

//register new user 
router.post("/register", userController.registerUser);

//login new user using jwt
router.post('/login', userController.loginUser);

//login with google
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

//google callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), userController.googleCallback);

// verify google account
router.post('/google/verify', userController.verifyGoogleToken)

//logout user
router.get("/logout", authenticateJWT, userController.logoutUser);

// edit profile
router.put("/edit/:id", authenticateJWT, userController.editUserProfile);

//get user profile
router.get("/profile/:id", authenticateJWT, userController.getUserProfile);

// delete user
router.delete("/delete/:id", authenticateJWT, userController.deleteUser);

// !!
// !! cart routes !!
// !!
router.use("/carts", cartRouter);

// !!
// !! wishlist routes !!
// !!
router.use("/wishlists", wishlistRouter);

// !!
// !! address routes !!
// !!
router.use("/addresses", addressRouter);

// !!
// !! order routes !!
// !!
router.use("/orders", orderRouter);

export const userRouter = router;