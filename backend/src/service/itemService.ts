import { DI } from "..";


export class itemService{
    static async getItemById(id: string) {
        return await DI.itemRepository.findOne(id);
    }

    static async getItemsByName(name: string) {
        const searchPattern = new RegExp(name, 'i'); // 'i' for case-insensitive search
        return await DI.itemRepository.find({ itemName: searchPattern });
    }

    static async getItemsByCategory(category: string) {
        const categories = category.split(','); // Split the category parameter into an array of categories
        const categoryEntity = await DI.categoryRepository.find({ categoryName: { $in: categories } });
        return await DI.itemRepository.find(categoryEntity, { populate: ['categories'] });
    }

    static async addItemToCategory(itemId: string, categoryId: string) {
        const item = await DI.itemRepository.findOne(itemId);
        const category = await DI.categoryRepository.findOne(categoryId);
        if (!item || !category) throw new Error('Item or Category not found');

        item.categories.add(category);
        await DI.itemRepository.flush();
        return item;
    }
}