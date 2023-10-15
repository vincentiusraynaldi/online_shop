import { Router } from 'express';

import { DI } from '../';
import {
CreateItemSchema,
CreateItemDTO,
Item
 } from '../entities';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
    const items = await DI.itemRepository.findAll();
    res.send(items);
});

router.post('/newItem', async (req, res) => {
    try{
        const validatedData = await CreateItemSchema.validate(req.body).catch(
            (err) => {res.status(400).send({ error: err.errors})}
        );
        if(!validatedData) return;
    
        const CreateItemDTO: CreateItemDTO = {
            ...validatedData
        };
    
        const existingItem = await DI.itemRepository.findOne({
             itemName: CreateItemDTO.itemName 
            });
        if(existingItem)
         return res.status(400).send({ message: 'Item already exists' });

        const newItem = new Item(CreateItemDTO);
        await DI.itemRepository.persistAndFlush(newItem);

        return res.status(201).json(newItem);
    }catch ( e: any){
        return res.status(400).send({ message: e.message });
    }
});

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

router.get('/id/:id', async (req, res) => {
    const item = await DI.itemRepository.findOne(req.params.id);
    res.send(req.params.id);
});

router.get('/name/:name', async (req, res) => {
    const item = await DI.itemRepository.findOne( req.params.name );
    res.send(item);
});

router.get('/category/:category', async (req, res) => {
    const items = await DI.itemRepository.find( req.params.category );
    res.send(items);
});

export const itemRouter = router;