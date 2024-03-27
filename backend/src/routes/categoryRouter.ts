import { Router } from "express";
import { DI } from "../";
import { Category } from "../entity";

const router = Router({ mergeParams: true });

// get all categories
router.get("/", async (req, res) => {
  const categories = await DI.categoryRepository.findAll();
  res.send(categories);
});

// get category by id
router.get("/id/:id", async (req, res) => {
    const category = await DI.categoryRepository.findOne({ id: req.params.id });
    if (!category) return res.status(404).send({ message: "Category not found" });
    res.send(category);
});

// add a category
router.post("/", async (req, res) => {
    try {
        if(!req.body.categoryName) return res.status(400).send({ message: 'Category name is required' });

        if (await DI.categoryRepository.findOne({ categoryName: req.body.categoryName }))
            return res.status(400).send({ message: "Category already exists" });

        const category = new Category(req.body.categoryName);
        await DI.categoryRepository.persistAndFlush(category);
        return res.status(201).json(category);
    } catch (e: any) {
        return res.status(400).send({ message: e.message });
    }
});

// delete category
router.delete("/:id", async (req, res) => {
    try {
        const category = await DI.categoryRepository.findOne({ id: req.params.id });
        if (!category) return res.status(404).send({ message: "Category not found" });

        await DI.categoryRepository.removeAndFlush(category);
        return res.status(200).send({ message: "Category deleted" });
    } catch (e: any) {
        return res.status(400).send({ message: e.message });
    }
});

export const categoryRouter = router;