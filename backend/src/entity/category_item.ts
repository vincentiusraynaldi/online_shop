import { BaseEntity } from "./baseEntity";
import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { Category, Item } from "./";

@Entity()
export class CategoryItem {

    @ManyToOne({ entity: () => Category, primary: true })
    categories = new Set<Category>;
    
    @ManyToOne({ entity: () => Item, primary: true })
    items = new Set<Item>;

    constructor(categories: Set<Category>, items: Set<Item>) {
        this.categories = categories;
        this.items = items;
    }
}