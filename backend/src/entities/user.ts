import {
    Entity,
    Property,
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { object, string} from "yup";
import { type } from "os";

@Entity()
export class User extends BaseEntity {

    @Property()
    password: string;

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

    constructor(
        { email, firstName, lastName, password }: RegisterUserDTO,
        // password: string,
        address?: string,
        city?: string,
        country?: string,
        postalCode?: string,
        phoneNumber?: string
    ) {
        super();
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.country = country;
        this.postalCode = postalCode;
        this.phoneNumber = phoneNumber;
    }
}

export type RegisterUserDTO = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
};

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