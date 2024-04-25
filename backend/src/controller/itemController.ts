import { Request, Response } from 'express';
import { DI } from '..';
import { itemMapper } from '../mapper';
import { CreateItemDTO } from '../dto';
import { CreateItemSchema } from '../entity';

export class itemController{
    static async getAllItems(req: Request, res: Response) {
        const items = await DI.itemRepository.findAll();
        res.status(200).send(items);
    }

    static async getItemById(req: Request, res: Response) {
        try {
            const item = await DI.itemRepository.findOne({ id: req.params.id });
            res.status(200).send(item);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async getItemsByName(req: Request, res: Response) {
        try {
            const searchPattern = new RegExp(req.params.name, 'i'); // 'i' for case-insensitive search
            const items = await DI.itemRepository.find({ itemName: searchPattern });
            res.send(items);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    // todo: must check if the user wanted to show items from multiple categories
    // !! check if query will be joined or seperated (items from all categories or items from each category)
    static async getItemsByCategory(req: Request, res: Response) {
        try {
            const categories = req.params.category.split(','); // Split the category parameter into an array of categories
            const categoryEntity = await DI.categoryRepository.find({ categoryName: { $in: categories } });
            const items = await DI.itemRepository.find(categoryEntity, { populate: ['categories'] });
            res.send(items);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async addItem(req: Request, res: Response) {
        try {
            const validatedData = await CreateItemSchema.validate(req.body).catch(
                (err) => { res.status(400).send({ error: err.errors }) }
            );

            if (!validatedData) return;

            const CreateItemDTO: CreateItemDTO = {
                ...validatedData,
                categories: req.body.categories || [],
            };

            const existingItem = await DI.itemRepository.findOne({
                itemName: CreateItemDTO.itemName
            });
            
            if (existingItem)
                return res.status(400).send({ message: 'Item already exists' });

            const newItem = itemMapper.createItemFromDTO(CreateItemDTO);
            await DI.itemRepository.persistAndFlush(newItem);

            return res.status(201).json(newItem);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }

    static async editItem(req: Request, res: Response) {
        try {
            const existingItem = await DI.itemRepository.findOne({ id: req.params.id });
            if (!existingItem) return res.status(404).send({ message: 'Item not found' });

            Object.assign(existingItem, req.body);
            await DI.itemRepository.flush();
            return res.status(200).json(existingItem);
        } catch (e: any) {
            return res.status(400).send({ message: e.message });
        }
    }
}