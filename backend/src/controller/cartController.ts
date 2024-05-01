import { cartService } from "../service/cartService";
import { Request, Response } from "express";

export class cartController{
    static async getAllItemsInCart(req: Request, res: Response){
        try {
            const items = await cartService.getAllItemsInCart(req.user.id);
            return res.status(200).send(items);
        } catch(e:any){
            return res.status(400).send({ message: e.message });
        }
    }

    static async addItemToCart(req: Request, res: Response){
        try {
            const cart = await cartService.addItemToCart(req.user.id, req.params.itemId, req.body);
            return res.status(200).send(cart);
        } catch(e:any){
            return res.status(400).send({ message: e.message });
        }
    }

    static async deleteItemFromCart(req: Request, res: Response){
        try {
            const cart = await cartService.deleteItemFromCart(req.user.id, req.params.itemId, req.body);
            return res.status(200).send(cart);
        } catch(e:any){
            return res.status(400).send({ message: e.message });
        }
    }

    static async checkout(req: Request, res: Response){
        try {
            const totalPrice = await cartService.checkout(req.user.id);
            return res.status(200).send(totalPrice);
        } catch(e:any){
            return res.status(400).send({ message: e.message });
        }
    }
}