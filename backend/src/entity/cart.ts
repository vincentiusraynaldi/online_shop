import { Collection, Embeddable, Entity, ManyToMany, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { Item, User } from "./";
import { CartItem } from "./cartItem";
import { BaseEntity } from "./baseEntity";

@Entity()
export class Cart extends BaseEntity{

    @OneToOne({ entity: () => User, onDelete: 'cascade' })
    user!: User;

    // Add properties here
    @ManyToMany({ entity: () => CartItem })
    items = new Collection<CartItem>(this);

    @Property()
    totalPrice!: number;
}