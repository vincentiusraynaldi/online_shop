import { Router } from "express";
import { DI } from "..";
import {
    LoginUserSchema,
    RegisterUserSchema,
    User
} from "../entity";
import {
    RegisterUserDTO, 
    RegisterGoogleUserDTO
} from "../dto/userDTO";
import { UserMapper } from "../mapper/userMapper";
import { Auth } from "../middleware/auth.middleware";
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
import { userService } from "../service/userService";

const router = Router({mergeParams: true});

//register new user 
router.post("/register", async (req, res) => {
    try{

        const newUser = await userService.registerUser(req.body);

        return res.status(201).json(newUser);
    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }
});

//login new user using jwt
router.post('/login', async (req, res) => {
    try{
    const loginResult = await userService.loginUser(req.body);

    if (loginResult) {
        return res.status(200).json({ accessToken: loginResult.token, id: loginResult.id });
    } else {
        return res.status(500).json({ error: "Internal Server Error"});
    }
    }catch(e: any){
        return res.status(400).json({ message: e.message });
    }
});

//login with google
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

//google callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {

    const token = userService.generateToken(req.user);
    
    console.log("token: ",token);
    console.log("req.user: ",req.user);

    //todo change the redirect to the home page of frontend
    // res.redirect(`http://localhost:4000?token=${token}`);
});

//logout user
router.get("/logout", (req, res) => {
    req.logout(() => {});
    return res.status(200).json({ message: "Logged out" });
});

// edit profile
router.put("/edit/:id", passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const editedUserResult = await userService.editProfile(req.params.id, req.body, req.user);
        return res.status(200).json(editedUserResult);
    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }
});

//get user profile
router.get("/profile/:id",passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        
        const userProfileResult = await userService.getUserProfile(req.params.id, req.user);
        
        return res.status(200).json( userProfileResult );

    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }
});

// delete user
router.delete("/delete/:id", passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const deletedUserResult = await userService.deleteUser(req.params.id, req.user);
        return res.status(200).json(deletedUserResult);
    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }
});

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