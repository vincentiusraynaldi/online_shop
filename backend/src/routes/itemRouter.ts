import { Router } from 'express';
import { DI } from '../di';
import { itemController } from '../controller/itemController';

//todo test the items
//todo test the wishlist
//todo test user

const router = Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Item management
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items (with filters, sorting and pagination)
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: Partial, case-insensitive match on item name
 *       - in: query
 *         name: categories
 *         schema:
 *           type: array
 *           items: { type: string }
 *         style: form
 *         explode: true
 *         description: Category names. The item must belong to ALL given categories.
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: inStock
 *         schema: { type: boolean }
 *         description: When "true", only items with stock > 0
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *         description: Partial, case-insensitive match on brand
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *         description: Only applied together with limit
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: itemName }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [ASC, DESC], default: ASC }
 *     responses:
 *       200:
 *         description: List of items with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedItems'
 */
router.get('/', itemController.getAllItems);

/**
 * @swagger
 * /items/newItem:
 *   post:
 *     summary: Add a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateItemRequest'
 *     responses:
 *       201:
 *         description: Item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error or item already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/newItem', itemController.addItem);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Edit an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditItemRequest'
 *     responses:
 *       200:
 *         description: Updated item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Item not found or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', itemController.editItem);

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get an item by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The item (null body if it does not exist)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Error while fetching
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', itemController.getItemById);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', itemController.deleteItem);
// // get items by name
// router.get('/name/:name', itemController.getItemsByName);

// // get items by category
// router.get('/category/:category', itemController.getItemsByCategory);

export const itemRouter = router;