import {
    Entity,
    ManyToMany,
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

    @ManyToMany({ entity: () => Item })
    item = new Set<Item>();

    //address
    @Property()
    address!: string;

    @Property()
    orderStatus!: string; //pending, processing, shipped, delivered

    @Property()
    paymentMethod!: string; //cash, card

    constructor(totalPrice: number) {
        super();
        this.totalPrice = totalPrice;
    }
}