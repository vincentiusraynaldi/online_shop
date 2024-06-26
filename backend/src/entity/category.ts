import { Collection, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { Entity, OneToMany } from "@mikro-orm/core";
import { Item } from "./item";
import { CategoryItem } from "./categoryItem";

@Entity()
export class Category extends BaseEntity{
    @Property()
    categoryName: string;

    @ManyToMany({ entity: () => Item, pivotEntity: () => CategoryItem,
    inversedBy: (item: Item) => item.categories})
    items = new Collection<Item>(this);

    constructor(categoryName: string) {
        super();
        this.categoryName = categoryName;
    }
}