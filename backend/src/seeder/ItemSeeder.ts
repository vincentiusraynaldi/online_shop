import { EntityManager } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";

import { Item } from "../entity";
import { Category } from "../entity";
import items from './data_set/item.json'

export class ItemSeeder extends Seeder {
    private normalizeCategories(category: string |string[]){
        const categories = Array.isArray(category) ? category : [category];
        return categories.map(cat=> cat.trim().toLowerCase());
    }

    async run(em: EntityManager): Promise<void> {
        const categories = await em.find(Category, {});
        const categoryMap = new Map(
            categories.map(cat =>[cat.categoryName.trim().toLowerCase(), cat])
        )

        for (const itemData of items){
            const item = new Item();
            item.itemName = itemData.itemName;
            item.itemDescription = itemData.itemDescription;
            item.itemPrice = itemData.itemPrice;
            item.itemWeight =  itemData.itemWeight;
            item.itemBrand = itemData.itemBrand;
            item.availableStock =  itemData.availableStock;


            //todo bind the item to the category
            //search the category wether it is in the database
            //if yes then bind the input the item to the category
            //if not dont put it in any category(?)
            const normalizedCategories = this.normalizeCategories(itemData.category)
            const foundCategories = normalizedCategories
            .map(cat=> categoryMap.get(cat)) // to search the category from the normalizedcategory to categoryMap
            .filter(Boolean) as Category[]; //to filter wether the category has a null or something similar value
            
            item.categories.set(foundCategories);
            em.persist(item)
        }
        await em.flush();
    }
}