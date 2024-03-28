import {
    Entity,
    ManyToMany,
    Property,
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import {
    Category 
} from "./";
import { object, string, number } from "yup";
import { CategoryItem } from "./category_item";

@Entity()
export class Item extends BaseEntity {

    @Property()
    itemName!: string;

    @Property()
    itemDescription!: string;

    @Property({type: 'decimal', scale: 2})
    itemPrice!: number;

    @Property()
    itemWeight!: number;

    @Property()
    itemBrand!: string;

    @Property()
    availableStock!: number;

    @ManyToMany({ entity: () => Category, pivotEntity: () => CategoryItem,
    mappedBy:(category: Category) => category.items})
    categories = new Set<Category>();

    // @Property()
    // itemImage: string[] | void ;

    // constructor({ 
    //     itemName,
    //     itemDescription,
    //     itemPrice,
    //     itemWeight,
    //     itemBrand,
    //     categories,
    //     // itemCategory,
    //     // itemImage
    //  }: CreateItemDTO) {
    //     super();
    //     this.itemName = itemName;
    //     this.itemDescription = itemDescription;
    //     this.itemPrice = itemPrice;
    //     this.itemWeight = itemWeight;
    //     this.itemBrand = itemBrand;
    //     this.categories = new Set(categories);
    //     // this.itemCategory = itemCategory;
    //     // this.itemImage = itemImage;
    // };

    constructor(){
        super();
    }
}

export const CreateItemSchema = object({
    itemName: string().required(),
    itemDescription: string().required(),
    itemPrice: number().required().positive(),
    itemWeight: number().required().positive().integer(),
    itemBrand: string().required(),
    categories: object().required(),
    // itemCategory: string().required(),
    // itemImage: string().required().min(0),
}) 