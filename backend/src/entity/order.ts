import {
    Collection,
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
import { Address } from "./address";
import { OrderItem } from "./orderItem";

@Entity()
export class Order extends BaseEntity {
    @Property()
    totalPrice: number;

    @ManyToOne({ entity: () => User })
    user!: User;

    @ManyToMany({ entity: () => OrderItem })
    items = new Collection<OrderItem>(this);

    //address
    @Property()
    address!: Address;

    @Property()
    orderStatus!: string; //pending, processing, shipped, delivered

    @Property()
    paymentMethod!: string; //cash, card

    constructor(totalPrice: number) {
        super();
        this.totalPrice = totalPrice;
    }
}