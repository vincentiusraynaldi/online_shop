import { CreateItemDTO } from "../dto/itemDTO";
import { Item } from "../entity/item";

class itemMapper {
    static createItemFromDTO(dto: CreateItemDTO): Item {
        const item = new Item();
        item.itemName = dto.itemName;
        item.itemDescription = dto.itemDescription;
        item.itemPrice = dto.itemPrice;
        item.itemWeight = dto.itemWeight;
        item.itemBrand = dto.itemBrand;
        item.categories = new Set(dto.categories);
        return item;
    }
}

export { itemMapper };