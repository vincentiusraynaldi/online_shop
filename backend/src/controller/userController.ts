import { userService } from '../service/userService';
import { Request, Response, Router } from 'express';

export class userController{

    static async registerUser(req: Request, res: Response){
        try {
            const newUser = await userService.registerUser(req.body);
            res.status(201).send(newUser);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });    
        }
    }

    static async loginUser(req: Request, res: Response){
        try {
            const loginResult = await userService.loginUser(req.body);

            if (loginResult) {
                return res.status(200).json({ accessToken: loginResult.token, id: loginResult.id });
            } else {
                return res.status(500).json({ error: "Internal Server Error"});
            }
        } catch (e: any) {
            return res.status(400).send({ message: e.message });    
        }
    }

    static async googleCallback(req: Request, res: Response){
        const token = userService.generateToken(req.user);
        console.log("token: ",token);
        console.log("req.user: ",req.user);
        //todo change the redirect to the home page of frontend
        // res.redirect(`http://localhost:4000?token=${token}`);
    }

    static async logoutUser(req: Request, res: Response){
        try {
            // const logoutResult = await userService.logoutUser(req.user);
            req.logout(() => {});
            res.status(200).send({ message: "Logged out" });
        } catch (e: any) {
            return res.status(400).send({ message: e.message });    
        }
    }
    
    static async editUserProfile(req: Request, res: Response){
        try{
            const updatedUser = await userService.editProfile(req.params.id, req.body, req.user);
            return res.status(200).json(updatedUser);
        }catch(e: any){
            return res.status(400).send({ message: e.message });
        }
    }

    static async getUserProfile(req: Request, res: Response){
        try{
            const userProfileResult = await userService.getUserProfile(req.params.id, req.user);
            res.status(200).json(userProfileResult);
        }
        catch(e: any){
            return res.status(400).send({ message: e.message });
        }
    }
    
    static async deleteUser(req: Request, res: Response){
        try{
            const deletionResult = await userService.deleteUser(req.params.id, req.user);
            return res.status(200).send(deletionResult);
        }catch(e: any){
            return res.status(400).send({ message: e.message });
        }
    } 
}