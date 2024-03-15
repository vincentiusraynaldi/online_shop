import {
    Entity,
    ManyToOne,
    OneToMany,
    Property,
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
// import { Wishlist } from "./wishlist";
import { object, string, number } from "yup";

@Entity()
export class Item extends BaseEntity {

    @Property()
    itemName: string;

    @Property()
    itemDescription: string;

    @Property({type: 'decimal', scale: 2})
    itemPrice: number;

    @Property()
    itemWeight: number;

    @Property()
    itemBrand: string;

    @Property()
    itemCategory: string;

    // @OneToMany(() => Wishlist, wishlist => wishlist.items)
    // wishlist: Wishlist;

    // @Property()
    // itemImage: string[] | void ;

    constructor({ 
        itemName,
        itemDescription,
        itemPrice,
        itemWeight,
        itemBrand,
        itemCategory,
        // itemImage
     }: CreateItemDTO) {
        super();
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemPrice = itemPrice;
        this.itemWeight = itemWeight;
        this.itemBrand = itemBrand;
        this.itemCategory = itemCategory;
        // this.itemImage = itemImage;
    };
}

export type CreateItemDTO = {
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemWeight: number;
    itemBrand: string;
    itemCategory: string;
    // itemImage: string[];
};

export type ItemDTO = {
    id: string;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemWeight: number;
    itemBrand: string;
    itemCategory: string;
    // itemImage: string[];
    createdAt: Date;
    updatedAt: Date;
};

export const CreateItemSchema = object({
    itemName: string().required(),
    itemDescription: string().required(),
    itemPrice: number().required().positive(),
    itemWeight: number().required().positive().integer(),
    itemBrand: string().required(),
    itemCategory: string().required(),
    // itemImage: string().required().min(0),
}) 