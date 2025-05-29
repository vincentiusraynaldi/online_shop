import { error } from 'console';
import { userService } from '../service/userService';
import { Request, Response, Router } from 'express';

export class userController{
    static async registerUser(req: Request, res: Response){
        try {
            const newUser = await userService.registerUser(req.body);
            return res.status(201).send(newUser);
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
        //TODO change the redirect to the home page of frontend
        // have to send the user entity as well to the frontend
        res.redirect(`http://localhost:5173/?token=${token}`);
    }

    static async verifyGoogleToken(req: Request, res: Response) {
        try{
            // //get credential
            const {credential} = req.body;
            
            if (!credential){
                res.status(400).json({message: "credential is required"})
            }
            //check if the user is already registered or not
            //if not then create a new user
            const result = await userService.verifyGoogleToken(credential);

            if(result.isNewUser){
                return res.status(201).send(result.user)
            }else{
                return res.status(200).json({accessToken: result.token, id: result.user?.id})
            }
        }catch{
            console.error("Google auth error:", error);
            return res.status(500).json({message: "Authentication failed"});
        }
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