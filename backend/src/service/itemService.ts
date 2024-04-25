import { DI } from "..";
import { CreateItemDTO } from "../dto";
import { CreateItemSchema } from "../entity";
import { itemMapper } from "../mapper";

export class itemService{
    static async getAllItems() {
        return await DI.itemRepository.findAll();
    }

    static async getItemById(id: string) {
        return await DI.itemRepository.findOne(id);
    }

    static async getItemsByName(name: string) {
        const searchPattern = new RegExp(name, 'i'); // 'i' for case-insensitive search
        return await DI.itemRepository.find({ itemName: searchPattern });
    }

    // todo: must check if the user wanted to show items from multiple categories
    // !! check if query will be joined or seperated (items from all categories or items from each category)
    static async getItemsByCategory(category: string) {
        const categories = category.split(',');
        const categoryEntity = await DI.categoryRepository.find({ categoryName: { $in: categories } });
        return await DI.itemRepository.find(categoryEntity, { populate: ['categories'] });
    }

    static async addItem(data: any) {
        const validatedData = await CreateItemSchema.validate(data).catch(
            (err) => { throw new Error(err.errors) }
        );

        if (!validatedData) throw new Error("Invalid data");

        const CreateItemDTO: CreateItemDTO = {
            ...validatedData,
            categories: data.categories || [],
        };

        const existingItem = await DI.itemRepository.findOne({
            itemName: CreateItemDTO.itemName
        });

        if (existingItem) throw new Error("Item already exists");

        const newItem = itemMapper.createItemFromDTO(CreateItemDTO);
        await DI.itemRepository.persistAndFlush(newItem);
        return newItem;
    }

    static async editItem(id: string, data: any) {
        const existingItem = await DI.itemRepository.findOne({ id });
        if (!existingItem) throw new Error("Item not found");

        Object.assign(existingItem, data);
        await DI.itemRepository.flush();
        return existingItem;
    }

    static async deleteItem(id: string) {
        const item = await DI.itemRepository.findOne({ id });
        if (!item) throw new Error("Item not found");

        await DI.itemRepository.removeAndFlush(item);
        return item;
    }
}