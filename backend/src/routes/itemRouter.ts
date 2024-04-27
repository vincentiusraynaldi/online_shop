import { Router } from 'express';
import { DI } from '..';
import { itemController } from '../controller/itemController';

//todo refactor the itemrouter itemcontroller and itemservice
//todo test the items
//todo test the wishlist
//todo test user

const router = Router({ mergeParams: true });

//get all item
router.get('/', itemController.getAllItems);

//add an item
router.post('/newItem', itemController.addItem);

//edit item
router.put('/:id', itemController.editItem);

//get item by id
router.get('/:id', itemController.getItemById);

// delete item
router.delete('/:id', itemController.deleteItem);

// get items by name
router.get('/name/:name', itemController.getItemsByName);

// get items by category
router.get('/category/:category', itemController.getItemsByCategory);

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