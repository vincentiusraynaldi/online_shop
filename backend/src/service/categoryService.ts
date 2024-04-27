import { DI } from "..";
import { Category } from "../entity";  

export class categoryService{
    static async getCategories(){
        return await DI.categoryRepository.findAll();
    }

    static async getCategoryById(id: string){
        return await DI.categoryRepository.findOne({ id }, { populate: ['items'] });
    }

    static async addCategory(categoryName: string){
        if(!categoryName) throw new Error('Category name is required');
        if (await DI.categoryRepository.findOne({ categoryName }))
            throw new Error("Category already exists");

        const category = new Category(categoryName);
        await DI.categoryRepository.persistAndFlush(category);
        return category;
    }

    static async deleteCategory(id: string){
        const category = await DI.categoryRepository.findOne({ id });
        if (!category) throw new Error("Category not found");

        await DI.categoryRepository.removeAndFlush(category);
        return { message: "Category deleted" };
    }

    static async updateCategory(id: string, data: any){
        const category = await DI.categoryRepository.findOne({ id });
        if (!category) throw new Error("Category not found");

        if (!data.categoryName) throw new Error("Category name is required");

        Object.assign(category, data);
        await DI.categoryRepository.flush();
        return category;
    }

    static async addItemToCategory(categoryId: string, itemId: string){
        const item = await DI.itemRepository.findOne({ id: itemId });
        if (!item) throw new Error('Item not found');

        const category = await DI.categoryRepository.findOne({ id: categoryId}, { populate: ['items']});
        if (!category) throw new Error('Category not found');

        category.items.add(item);
        await DI.categoryRepository.flush();
        return category;
    }

    static async deleteItemFromCategory(categoryId: string, itemId: string){
        const item = await DI.itemRepository.findOne({ id: itemId });
        if (!item) throw new Error('Item not found');

        const category = await DI.categoryRepository.findOne({ id: categoryId}, { populate: ['items']});
        if (!category) throw new Error('Category not found');

        category.items.remove(item);
        await DI.categoryRepository.flush();
        return category;
    }
}