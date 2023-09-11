import {
    Entity,
    Property,
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";

@Entity()
export class Item extends BaseEntity {

    @Property()
    itemName: string;

    @Property()
    itemDescription: string;

    @Property()
    itemPrice: number;

    @Property()
    itemWeight: number;

    @Property()
    itemBrand: string;

    @Property()
    itemCategory: string;

    constructor({ itemName, itemDescription, itemPrice, itemWeight, itemBrand, itemCategory }: CreateItemDTO) {
        super();
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemPrice = itemPrice;
        this.itemWeight = itemWeight;
        this.itemBrand = itemBrand;
        this.itemCategory = itemCategory;
    };
}

export type CreateItemDTO = {
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemWeight: number;
    itemBrand: string;
    itemCategory: string;
};

export type ItemDTO = {
    id: string;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemWeight: number;
    itemBrand: string;
    itemCategory: string;
    createdAt: Date;
    updatedAt: Date;
};