import {
    Entity,
    PrimaryKey,
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
}