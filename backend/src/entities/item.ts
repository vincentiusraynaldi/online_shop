import {
    Entity,
    PrimaryKey,
    Property,

}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { stringify } from "uuid";

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

    constructor({ itemName, itemDescription, itemPrice, itemWeight }: CreateItemDTO) {
        super();
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.itemPrice = itemPrice;
        this.itemWeight = itemWeight;
    };
}

export type CreateItemDTO = {
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemWeight: number;
};

export type ItemDTO = {
    id: string;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemWeight: number;
    createdAt: Date;
    updatedAt: Date;
};