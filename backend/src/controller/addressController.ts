import { Request, Response } from 'express';
import { addressService } from '../service/addressService';

export class addressController {
    static async getAdresses(req: Request, res: Response) {
        try{
            const addresses = await addressService.getAddresses(req.user);
            res.status(200).send(addresses);
        }catch(e: any){
            return res.status(400).send({message: e.message});
        }
    }

    static async getAddressById(req: Request, res: Response) {
        try{
            const address = await addressService.getAddressById(req.params.id, req.user);
            res.status(200).send(address);
        }catch(e: any){
            return res.status(400).send({message: e.message});
        }
    
    }

    static async createAddress(req: Request, res: Response) {
        try{
            const address = await addressService.createAddress(req.body, req.user);
            res.status(201).send(address);
        }catch(e: any){
            return res.status(400).send({message: e.message});
        }
    }

    static async updateAddress(req: Request, res: Response) {
        try{
            const address = await addressService.updateAddress(req.params.id, req.body, req.user);
            res.status(200).send(address);
        }catch(e: any){
            return res.status(400).send({message: e.message});
        }
    }

    static async deleteAddress(req: Request, res: Response) {
        try{
            await addressService.deleteAddress(req.params.id, req.user);
            res.status(200).send({message: "Address deleted"});
        }catch(e: any){
            return res.status(400).send({message: e.message});
        }
    }
}