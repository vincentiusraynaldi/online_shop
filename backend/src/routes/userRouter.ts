import { Router } from "express";
import { DI } from "../";
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
import { 
    wishlistRouter,
    cartRouter
} from "./";

const router = Router({mergeParams: true});

//register new user 
router.post("/register", async (req, res) => {
    try{
        const validatedData = await RegisterUserSchema.validate(req.body).catch(
            (err) => {
                res.status(400).json({ error: err.errors });
            }
        );
        if(!validatedData){
            return;
        }

        const RegisterUserDTO: RegisterUserDTO = {
            ...validatedData,
            email: validatedData.email.toLowerCase(),
            //todo: make the password have password best practices
            //(uppercase, lowercase, number, special character, length)
            password: await Auth.hashPassword(validatedData.password),
        }
        
        // const password = await Auth.hashPassword(validatedData.password);

        //check if email already exist
        const existingUser = await DI.userRepository.findOne({
            email: req.body.email.toLowerCase()
        });
        if (existingUser)
        {
            return res.status(400).json({ error: "Email already in use"})
        }

        // const newUser = new User(RegisterUserDTO.email, RegisterUserDTO.firstName, RegisterUserDTO.lastName, RegisterUserDTO.password);
        const newUser = UserMapper.createUserFromRegisterUserDTO(RegisterUserDTO);
        await DI.userRepository.persistAndFlush(newUser);

        return res.status(201).json({ 
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            address: newUser.address,
            });
    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }
});

//login new user
router.post('/login', async (req, res) => {
    try{
        // check if the email and password are valid
    const validatedData = await LoginUserSchema.validate(req.body).catch(
        (err) => {
            res.status(400).json({ error: err.errors });
        }
    );

    if(!validatedData){
        return;
    }

    //check if the user exist
    const existingUser = await DI.userRepository.findOne({ 
        email: validatedData.email.toLowerCase() 
    });

    if(!existingUser){
        return res.status(400).json({ error: "Email not found"});
    }

    //check if there is password for the user
    if (!existingUser.password) {
        return res.status(400).json({ error: "Invalid password"});
    }

    //check if the password is correct
    const validPassword = await Auth.comparePasswordwithHash(
        validatedData.password,
        existingUser.password
    );

    if (!validPassword) {
        return res.status(400).json({ error: "Invalid password"});
    }

    //generate token
    const token = Auth.generateToken({ 
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
    });

    if (token) {
        return res.status(200).json({ accessToken: token, id: existingUser.id });
    } else {
        return res.status(500).json({ error: "Internal Server Error"});
    }
    }catch(e: any){
        return res.status(400).json({ message: e.message });
    }
});

// edit profile
// router.put("/edit/:id", Auth.verifyAccess, async (req, res) => {
router.put("/edit/:id", passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const id = req.params.id;
        const exitstingUser = await DI.userRepository.findOne(id);
        if (!exitstingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        if(req.user?.email === exitstingUser?.email){
            req.body.password = await Auth.hashPassword(req.body.password);
            Object.assign(exitstingUser, req.body);
            await DI.userRepository.flush();
            return res.status(200).json( exitstingUser );
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }
});

//get user profile
// router.get("/profile/:id", Auth.verifyAccess, async (req, res) => {
router.get("/profile/:id",passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const id = req.params.id;
        const exitstingUser = await DI.userRepository.findOne(id);
        if (!exitstingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        if(req.user?.email === exitstingUser?.email){
            return res.status(200).json( exitstingUser );
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }
});

//logout user

// get order info
//todo check if correct
router.get('/orders/:orderId', async (req, res) => {
    try{
        const id = req.params.orderId;
        const order = await DI.orderRepository.findOne(id);
        if(!order){
            return res.status(404).json({ error: "Order not found" });
        }

        if(req.user?.id === order.user.id){
            return res.status(200).json(order);
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    catch(e: any){
        return res.status(400).json({ message: e.message });
    }
});


// !!
// !! cart routes !!
// !!
router.use("/cart", cartRouter);

// !!
// !! wishlist routes !!
// !!
router.use("/wishlist", wishlistRouter);


export const userRouter = router;