import { BaseEntity } from "./baseEntity";
import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { Category } from "./category";
import { Item } from "./item";

@Entity()
export class CategoryItem {

    @ManyToOne({ entity: () => Category, primary: true })
    categories: Set<Category>;
    
    @ManyToOne({ entity: () => Item, primary: true })
    items: Set<Item>;

    constructor(categories: Set<Category>, items: Set<Item>) {
        this.categories = categories;
        this.items = items;
    }
}