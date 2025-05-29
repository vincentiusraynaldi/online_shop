import { DI } from "..";
import { RegisterGoogleUserDTO, RegisterUserDTO } from "../dto";
import { RegisterUserSchema, LoginUserSchema, User, RegisterGoogleUserSchema } from "../entity";
import { Auth } from "../middleware/auth.middleware";
import { UserMapper } from "../mapper/userMapper";
import { envGoogleClientId, googleClient } from '..';
import { SmallIntType } from "@mikro-orm/core";

interface RegisterUserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export class userService {

    static generateToken(data: any) {
        return Auth.generateToken({
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
        });
    }

    static async getUserById(id: string) {
        return await DI.userRepository.findOne(id);
    }

    static async getUserByEmail(email: string) {
        return await DI.userRepository.findOne({ email: email.toLowerCase() });
    }

    static async registerUser(data: any) {
        
        const validatedData = await RegisterUserSchema.validate(data);
        if (!validatedData) throw new Error("Invalid data");

        const RegisterUserDTO: RegisterUserDTO = {
            ...validatedData,
            email: validatedData.email.toLowerCase(),
            password: await Auth.hashPassword(validatedData.password),
        }

        const existingUser = await DI.userRepository.findOne({
            email: RegisterUserDTO.email.toLowerCase()
        });

        if (existingUser) {
            throw new Error("Email already in use");
        }

        const newUser = UserMapper.createUserFromRegisterUserDTO(RegisterUserDTO);
        await DI.userRepository.persistAndFlush(newUser);
        console.log("new user: ", newUser);
        return newUser;
    }

    static async loginUser(data: any) {
        const validatedData = await LoginUserSchema.validate(data);
        if (!validatedData) throw new Error("Invalid data");

        const existingUser = await this.getUserByEmail(validatedData.email);

        if (!existingUser) {
            throw new Error("Email not found");
        }

        if(!existingUser.password){
            throw new Error("Password not found");
        }

        const isPasswordValid = await Auth.comparePasswordwithHash(
            validatedData.password,
            existingUser.password
        );

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const token = this.generateToken(existingUser);

        return {token, id: existingUser.id};
    }

    static async editProfile(id: string, data: any, user: User) {
        const existingUser = await this.getUserById(id);
        if (!existingUser) {
            throw new Error("User not found");
        }

        if( user.email === existingUser.email){
            data.password = await Auth.hashPassword(data.password);
            Object.assign(existingUser, data);
            await DI.userRepository.flush();
            return existingUser;
        } else {
            throw new Error("Unauthorized");
        }
    }

    static async getUserProfile(id: string, user: User) {
        const existingUser = await this.getUserById(id);
        if (!existingUser) {
            throw new Error("User not found");
        }

        if(user.email === existingUser.email){
            return existingUser;
        } else {
            throw new Error("Unauthorized");
        }
    }

    static async deleteUser(id: string, user: User) {

        const existingUser = await DI.userRepository.findOne(id, { populate: ["cart", "addresses", "orders", "wishlists"] });

        if (!existingUser) {
            throw new Error("User not found");
        }

        if(user.email === existingUser.email){
            await DI.userRepository.removeAndFlush(existingUser);
            return { message: "User deleted" };
        } else {
            throw new Error("Unauthorized");
        }
    }

    static async verifyGoogleToken(credential : string){
        try{
             const result = await googleClient.verifyIdToken({
                idToken: credential,
                audience: envGoogleClientId
            })

            const payload = result.getPayload();
            if (!payload){
                throw new Error("Invalid token payload")
            }
            
            if(!payload.email){         
                console.error("Google token missing email")  
                throw new Error("there is no email")
            }
            let user = await this.getUserByEmail(payload.email.toLowerCase())
            let isNewUser = false
            if (!user){
                const RegisterGoogleUserDTO : RegisterGoogleUserDTO = {
                    email: payload.email.toLowerCase(),
                    firstName: payload.given_name || "",
                    lastName: payload.family_name || "",
                    googleId: payload.sub
                }

                user = await UserMapper.createUserFromRegisterGoogleUserDTO(RegisterGoogleUserDTO);
                await DI.userRepository.persistAndFlush(user);
                isNewUser = true;
            }

            console.log("user: ", user)
            // user = await this.getUserByEmail(payload.email.toLowerCase())
            const token = this.generateToken(user);

            return {token, user, isNewUser};
        }catch(error){
            console.error("Google token verification failed:", error);
            throw new Error("Google authentication failed");
        }
    }
}