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

export const itemRouter = router;