import {
    Embedded,
    Entity,
    OneToMany,
    Property,
    OneToOne,
    Collection,
    ManyToMany
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { object, string } from "yup";
import { 
    Wishlist,
    Cart,
    Address, 
    Order
}
from ".";

@Entity()
export class User extends BaseEntity {

    @Property({ nullable: true })
    password?: string;

    @Property()
    email!: string;

    @Property()
    firstName!: string;

    @Property()
    lastName!: string;

    @Property({ nullable: true })
    phoneNumber?: string;

    @Property({ nullable: true })
    googleId?: string;

    @OneToMany({entity: () => Wishlist, mappedBy: 'user', orphanRemoval: true})
    wishlists = new Collection<Wishlist>(this);

    @OneToOne({ entity: () => Cart, owner: true, nullable: true, orphanRemoval: true })
    cart = new Cart(this);

    @OneToMany({ entity: () => Order, mappedBy: 'user', orphanRemoval: true})
    orders = new Collection<Order>(this);

    @OneToMany({ entity: () => Address, mappedBy: 'user', orphanRemoval: true})
    addresses = new Collection<Address>(this);

    constructor() {
        super();
    }
}

export const RegisterUserSchema = object({
    password: string().required(),
    email: string().required(),
    firstName: string().required(),
    lastName: string().required(),
});

export const LoginUserSchema = object({
    password: string().required(),
    email: string().required(),
});

export const EditProfileSchema = object({
    firstName: string().required(),
    lastName: string().required(),
    email: string().required()
})

export const ChangePasswordSchema = object({
    currentPassword: string().required(),
    newPassword: string().required(),
    confirmPassword: string().required()
});

export const RegisterGoogleUserSchema = object({
    email: string().required(),
    firstName: string().required(),
    lastName: string().required(),
    googleId: string().required(),
});