import { Request, Response } from 'express';
import { categoryService } from '../service/categoryService';

export class categoryController{
    static async getCategories(req: Request, res: Response){
        try {
            const categories = await categoryService.getCategories();
            res.send(categories);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async getCategoryById(req: Request, res: Response){
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) return res.status(404).send({ message: "Category not found" });
            res.send(category);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async addCategory(req: Request, res: Response){
        try{
            const category = await categoryService.addCategory(req.body.categoryName);
            return res.status(201).json(category);
        }catch(e: any){
            return res.status(400).send({ message: e.message });
        }
    }

    static async deleteCategory(req: Request, res: Response){
        try {
            const category = await categoryService.deleteCategory(req.params.id);
            return res.status(200).send(category);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async updateCategory(req: Request, res: Response){
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            return res.status(200).send({message: "Category updated" });
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async addItemToCategory(req: Request, res: Response){
        try {
            const category = await categoryService.addItemToCategory(req.params.categoryId, req.params.itemId);
            return res.status(200).send({ message: "Item added to category" });
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async deleteItemFromCategory(req: Request, res: Response){
        try {
            const category = await categoryService.deleteItemFromCategory(req.params.categoryId, req.params.itemId);
            return res.status(200).send({ message: "Item deleted from category"});
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }
}