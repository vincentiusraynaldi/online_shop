import { Router } from 'express';

import { DI } from '..';
import {
CreateItemSchema,
Wishlist
 } from '../entity';
import { CreateItemDTO } from '../dto';
import { itemMapper } from '../mapper';
import passport from 'passport';
import { Collection } from '@mikro-orm/core';

const router = Router({ mergeParams: true });

//get all item
router.get('/', async (req, res) => {
    const items = await DI.itemRepository.findAll();
    res.send(items);
});

//add an item
router.post('/newItem', async (req, res) => {
    try{
        const validatedData = await CreateItemSchema.validate(req.body).catch(
            (err) => {res.status(400).send({ error: err.errors})}
        );
        if(!validatedData) return;
    
        const CreateItemDTO: CreateItemDTO = {
            ...validatedData,
            categories: req.body.categories || [],
        };
    
        const existingItem = await DI.itemRepository.findOne({
             itemName: CreateItemDTO.itemName 
            });
        if(existingItem)
         return res.status(400).send({ message: 'Item already exists' });

        const newItem = itemMapper.createItemFromDTO(CreateItemDTO);
        await DI.itemRepository.persistAndFlush(newItem);

        return res.status(201).json(newItem);
    }catch ( e: any){
        return res.status(400).send({ message: e.message });
    }
});

//edit item
router.put('/edit/:id', async (req, res) => {
    try{
        const existingItem = await DI.itemRepository.findOne({ id: req.params.id });
        if(!existingItem) return res.status(404).send({ message: 'Item not found' });

        Object.assign(existingItem, req.body);
        await DI.itemRepository.flush();
        return res.status(200).json(existingItem);
    }catch(e:any){
        return res.status(400).send({ message: e.message });
    }
});


//get item by id
router.get('/id/:id', async (req, res) => {
    try {
        const item = await DI.itemRepository.findOne({ id: req.params.id });
        res.send(item);
    } catch (e: any) {
        return res.status(400).send({ message: e.message });
        
    }
});

// get items by name
router.get('/name/:name', async (req, res) => {
    try {
        const searchPattern = new RegExp(req.params.name, 'i'); // 'i' for case-insensitive search
        const items = await DI.itemRepository.find({ itemName:  searchPattern });
        res.send(items);
    } catch (e: any) {
        return res.status(400).send({ message: e.message });
        
    }
});


// get items by category
// todo: must check if the user wanted to show items from multiple categories
// !! check if query will be joined or seperated (items from all categories or items from each category)
router.get('/category/:category', async (req, res) => {
try {
        const categories = req.params.category.split(','); // Split the category parameter into an array of categories
        const categoryEntity = await DI.categoryRepository.find({ categoryName: { $in: categories } });
        const items = await DI.itemRepository.find(categoryEntity, { populate: ['categories'] });
        res.send(items);
} catch (e: any) {
        return res.status(400).send({ message: e.message });    
}
});

// add item to category
router.put('/addCategory/:itemId/:categoryId', async (req, res) => {
try {
        const item = await DI.itemRepository.findOne({ id: req.params.itemId });
        const category = await DI.categoryRepository.findOne({ id: req.params.categoryId });
        if (!item || !category) return res.status(404).send({ message: 'Item or Category not found' });
    
        item.categories.add(category);
        await DI.itemRepository.flush();
        res.send(item);
} catch (e: any) {
    return res.status(400).send({ message: e.message });
}
});

export const itemRouter = router;