import { Request, Response } from 'express';
import { itemService } from '../service/itemService';

export class itemController{
    static async getAllItems(req: Request, res: Response) {
        const items = await itemService.getAllItems();
        res.status(200).send(items);
    }

    static async getItemById(req: Request, res: Response) {
        try {
            const item = await itemService.getItemById(req.params.id);
            res.status(200).send(item);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async getItemsByName(req: Request, res: Response) {
        try {
            const items = await itemService.getItemsByName(req.params.name);
            res.status(200).send(items);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    // todo: must check if the user wanted to show items from multiple categories
    // !! check if query will be joined or seperated (items from all categories or items from each category)
    static async getItemsByCategory(req: Request, res: Response) {
        try {
            const items = await itemService.getItemsByCategory(req.params.category);
            res.send(items);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async addItem(req: Request, res: Response) {
        try {

            const newItem = await itemService.addItem(req.body);

            return res.status(201).json(newItem);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async editItem(req: Request, res: Response) {
        try {
            const existingItem = await itemService.editItem(req.params.id, req.body);
            return res.status(200).json(existingItem);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async deleteItem(req: Request, res: Response) {
        try {
            const item = await itemService.deleteItem(req.params.id);
            return res.status(200).send({ message: "Item deleted" });
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }
}