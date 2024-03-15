import {
    Entity,
    Property,
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { object, string} from "yup";
import { RegisterUserDTO } from "../dto/userDTO";
import { type } from "os";

@Entity()
export class User extends BaseEntity {

    @Property({ nullable: true })
    password?: string;

    @Property()
    email: string;

    @Property()
    firstName: string;

    @Property()
    lastName: string;

    @Property({ nullable: true })
    address?: string;

    @Property({ nullable: true })
    city?: string;

    @Property({ nullable: true })
    country?: string;

    @Property({ nullable:true })
    postalCode?: string;

    @Property({ nullable: true })
    phoneNumber?: string;

    @Property({ nullable: true })
    googleId?: string;

    constructor(
        email: string,
        firstName: string,
        lastName: string,
        // password?: string,
        // address?: string,
        // city?: string,
        // country?: string,
        // postalCode?: string,
        // phoneNumber?: string
    ) {
        super();
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        // this.password = password;
        // this.address = address;
        // this.city = city;
        // this.country = country;
        // this.postalCode = postalCode;
        // this.phoneNumber = phoneNumber;
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

export const RegisterGoogleUserSchema = object({
    email: string().required(),
    firstName: string().required(),
    lastName: string().required(),
    googleId: string().required(),
});