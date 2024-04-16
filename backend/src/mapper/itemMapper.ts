import { CreateItemDTO } from "../dto/itemDTO";
import { Item, Category } from "../entity/";
import { Collection } from "@mikro-orm/core";

class itemMapper {
    static createItemFromDTO(dto: CreateItemDTO): Item {
        const item = new Item();
        item.itemName = dto.itemName;
        item.itemDescription = dto.itemDescription;
        item.itemPrice = dto.itemPrice;
        item.itemWeight = dto.itemWeight;
        item.itemBrand = dto.itemBrand;
        item.categories = new Collection<Category>(item);
        return item;
    }
}

export { itemMapper };