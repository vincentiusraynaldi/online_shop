import { Entity, ManyToOne, Property } from "@mikro-orm/core"
import { Item } from ".";
import { BaseEntity } from "./baseEntity";

@Entity()
export class CartItem extends BaseEntity{
    @ManyToOne({ entity: () => Item })
    item!: Item;

    @Property()
    quantity!: number;

    constructor(item: Item, quantity: number){
        super();
        this.item = item;
        this.quantity = quantity;
    }
}