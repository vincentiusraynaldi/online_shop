import { DI } from "../di";
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

        if (query.categories) {

            const categoryNames = Array.isArray(query.categories) 
                ? query.categories 
                : [query.categories]; 

            where.$and = categoryNames.map((name: string) => ({
                categories: { $some: { category_name : name } }
            }));
        }

        // min price max price
        if(query.minPrice || query.maxPrice){
            where.itemPrice = {};
            if(query.minPrice) where.itemPrice.$gte = parseFloat(query.minPrice as string);
            if(query.maxPrice) where.itemPrice.$lte = parseFloat(query.maxPrice as string);
        }

        // in stock
        if (query.inStock === "true"){
            where.availableStock = { $gt : 0 };
        }

        // brand
        if(query.brand){
            where.itemBrand = { $ilike: `%${query.brand as string}%`};
        }

        const offset = query.page && query.limit ?
        (parseInt(query.page as string) - 1) * parseInt(query.limit as string)
        : undefined;

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
        await DI.em.flush();
        return existingItem;
    }

    static async deleteItem(id: string) {
        const item = await DI.itemRepository.findOne({ id });
        if (!item) throw new Error("Item not found");

        await DI.em.removeAndFlush(item);
        return item;
    }
}