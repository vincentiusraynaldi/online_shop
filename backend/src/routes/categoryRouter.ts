import { Router } from "express";
import { categoryController } from "../controller/categoryController";

const router = Router({ mergeParams: true });

// get all categories
router.get("/", categoryController.getCategories);

// add a category
router.post("/", categoryController.addCategory);

// get category by id
router.get("/:id", categoryController.getCategoryById);

// update category
router.put("/:id", categoryController.updateCategory);

// delete category
router.delete("/:id", categoryController.deleteCategory);

// add item to category
router.post('/:categoryId/items/:itemId', categoryController.addItemToCategory);

// delete item from category
router.delete('/:categoryId/items/:itemId', categoryController.deleteItemFromCategory);

export const categoryRouter = router;