import {
    Entity,
    ManyToOne,
    OneToMany,
    Property,
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { object, string, number } from "yup";
import { Item } from "./item";
import { User } from "./user";

@Entity()
export class Order extends BaseEntity {
    @Property()
    totalPrice: number;

    @ManyToOne({ entity: () => User })
    user!: User;

    // @OneToMany({ mappedBy: , entity: () => Item })
    // item!: Item[];

    //address
    
    //payment method

    constructor(totalPrice: number) {
        super();
        this.totalPrice = totalPrice;
    }
}