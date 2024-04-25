import { wishlistService } from "../service/wishlistService";
import { Request, Response } from "express";

export class wishlistController {
    static async addWishlist(req: Request, res: Response) {
        try {
            const wishlist = await wishlistService.addWishlist(req.body, req.user);

            return res.status(201).json(wishlist);
        }catch (e: any) {
            return res.status(400).send({ message: e.message });        
        }
    }

    static async getAllWishlist(req: Request, res: Response) {
        try {
            const wishlists = await wishlistService.getAllWishlist(req.user);

            return res.status(200).send(wishlists);
        }catch (e: any) {
            return res.status(400).send({ message: e.message });        
        }
    }

    static async getWishlistById(req: Request, res: Response) {
        try {
            const wishlist = await wishlistService.getWishlistById(req.params.id, req.user);

            return res.status(200).send(wishlist);
        }catch (e: any) {
            return res.status(400).send({ message: e.message });        
        }
    }

    static async updateWishlist(req: Request, res: Response) {
        try {
            const updatedWishlist = await wishlistService.updateWishlist(req.params.id, req.user, req.body);

            return res.status(200).json(updatedWishlist);
        }catch (e: any) {
            return res.status(400).send({ message: e.message });        
        }
    }

    static async deleteWishlist(req: Request, res: Response) {
        try {
            const deletionResult = await wishlistService.deleteWishlist(req.params.id, req.user);

            return res.status(200).send(deletionResult);
        }catch (e: any) {
            return res.status(400).send({ message: e.message });        
        }
    }

    static async deleteItemFromWishlist(req: Request, res: Response) {
        try {
            const deletionResult = await wishlistService.deleteItemFromWishlist(req.params.id, req.params.itemId, req.user);

            return res.status(200).send(deletionResult);
        }catch (e: any) {
            return res.status(400).send({ message: e.message });        
        }
    }

    static async addItemToWishlist(req: Request, res: Response) {
        try {
            const addItemResult = await wishlistService.addItemToWishlist(req.params.wishlistId, req.params.itemId, req.user);

            return res.status(200).send(addItemResult);
        }catch (e: any) {
            return res.status(400).send({ message: e.message });        
        }
    }
}

