import { Router } from "express";
import passport from "passport";
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

//verify google account
router.post('/google/verify', userController.verifyGoogleToken)

//logout user
router.get("/logout", authenticateJWT, userController.logoutUser);

//edit profile
router.put("/editprofile", authenticateJWT, userController.editUserProfile);

//change user password
router.put("/password", authenticateJWT, userController.changePassword);

//change user email
router.put("/email", authenticateJWT, userController.changeEmail);

//get user profile
router.get("/profile", authenticateJWT, userController.getUserProfile);

// delete user
router.delete("/delete", authenticateJWT, userController.deleteUser);

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