import { Request, Response } from 'express';
import { orderService } from '../service/orderService';

export class orderController{
    static async getOrders(req: Request, res: Response){
        try{
            const orders = await orderService.getOrders(req.user.id);
            res.status(200).send(orders);
        }
        catch(e:any){
            return res.status(400).send({ message: e.message });
        }
    }

    static async getOrder(req: Request, res: Response){
        try{
            const order = await orderService.getOrder(req.user.id, req.params.id);
            res.status(200).send(order);
        }
        catch(e:any){
            return res.status(400).send({ message: e.message });
        }
    }
}