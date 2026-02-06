import { DI } from "..";
import { CreateItemDTO } from "../dto";
import { CreateItemSchema } from "../entity";
import { itemMapper } from "../mapper";

export class itemService{
    static async getAllItems(query: any) {
        console.log(query);

        const where : any = {};

        if(query.name){
            where.itemName = { $ilike: `%${query.name}%` };
        }

        if(query.categories){
            const categoryList = query.categories.split(',');
            where.categories = { $some: {id: categoryList}};
        }

        // min price max price
        if(query.minPrice || query.maxPrice){
            where.itemPrice = {};
            if(query.minPrice) where.itemPrice.$gte = parseFloat(query.minPrice as string);
            if(query.maxPrice) where.itemPrice.$lte = parseFloat(query.maxPrice as string);
        }

        // in stock
        if (query.inStock = "true"){
            where.availableStock = { $gt : 0 };
        }

        // brand
        if(query.brand){
            where.itemBrand = { $ilike: `%${query.brand as string}$`};
        }

        // todo pagination, sort filter

        // if (query.page || query.limit){
        //     query.offset = (parseInt(query.page as string) - 1) * parseInt(query.limit as string);
        // }

        const offset = query.page && query.limit ?
        (parseInt(query.page as string) - 1) * parseInt(query.limit as string)
        : undefined;

        // if (query.sortOrder || query.sortBy){

        // }

        // return await DI.itemRepository.findAndCount(
        const [items, total] = await DI.itemRepository.findAndCount(
            where,
        {
            populate: ['categories'],
            orderBy: { [query.sortBy|| 'itemName' ]: query.sortOrder || 'ASC' },
            limit: query.limit,
            offset: offset
        });

        return {
            data: items,
            pagination: {
                page: query.page,
                limit: query.limit,
                total: total,
                totalPages: Math.ceil(total/query.limit)
            }
        }
    }

    static async getItemById(id: string) {
        return await DI.itemRepository.findOne(id);
    }

    // static async getItemsByName(name: string) {
    //     // search for items with the given name
    //     // it can be a partial search
    //     const searchPattern = new RegExp(name, 'i'); // 'i' for case-insensitive search
    //     return await DI.itemRepository.find({ itemName: searchPattern });
    // }

    // // todo: must check if the user wanted to show items from multiple categories
    // // !! check if query will be joined or seperated (items from all categories or items from each category)
    // static async getItemsByCategory(category: string) {
    //     const categories = category.split(',');
    //     const categoryEntity = await DI.categoryRepository.find({ categoryName: { $in: categories } });
    //     return await DI.itemRepository.find(categoryEntity, { populate: ['categories'] });
    // }

    static async addItem(data: any) {
        const validatedData = await CreateItemSchema.validate(data);

        if (!validatedData) throw new Error("Invalid data");

        const CreateItemDTO: CreateItemDTO = {
            ...validatedData,
            categories: data.categories || [],
        };

        const existingItem = await DI.itemRepository.findOne({
            itemName: CreateItemDTO.itemName
        });

        if (existingItem){ throw new Error("Item already exists");}

        const newItem = itemMapper.createItemFromDTO(CreateItemDTO);
        // await DI.itemRepository.persistAndFlush(newItem);
        await DI.em.persistAndFlush(newItem);
        return newItem;
    }

    static async editItem(id: string, data: any) {
        const existingItem = await DI.itemRepository.findOne({ id });
        if (!existingItem) throw new Error("Item not found");

        Object.assign(existingItem, data);
        // await DI.itemRepository.flush();
        await DI.em.flush();
        return existingItem;
    }

    static async deleteItem(id: string) {
        const item = await DI.itemRepository.findOne({ id });
        if (!item) throw new Error("Item not found");

        // await DI.itemRepository.removeAndFlush(item);
        await DI.em.removeAndFlush(item);
        return item;
    }
}