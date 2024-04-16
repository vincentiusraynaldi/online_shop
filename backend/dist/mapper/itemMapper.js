"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemMapper = void 0;
const entity_1 = require("../entity/");
const core_1 = require("@mikro-orm/core");
class itemMapper {
    static createItemFromDTO(dto) {
        const item = new entity_1.Item();
        item.itemName = dto.itemName;
        item.itemDescription = dto.itemDescription;
        item.itemPrice = dto.itemPrice;
        item.itemWeight = dto.itemWeight;
        item.itemBrand = dto.itemBrand;
        item.categories = new core_1.Collection(item);
        return item;
    }
}
exports.itemMapper = itemMapper;
