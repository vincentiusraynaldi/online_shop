import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { User } from ".";
import { object, string } from "yup";

@Entity()
export class Address extends BaseEntity{
    @ManyToOne({ entity: () => User })
    user!: User;

    @Property({ nullable: false })
    fullName!: string;

    @Property({ nullable: false })
    street!: string;

    @Property({ nullable: false })
    houseNumber!: string;

    //todo: more info string
    // @Property({ nullable: true })

    @Property({ nullable: false })
    city!: string;

    @Property({ nullable: false })
    country!: string;

    @Property({ nullable: false })
    postalCode!: string;

    constructor(){
        super();
    }
}

export const CreateNewAddressSchema = object({
    street: string().required(),
    houseNumber: string().required(),
    city: string().required(),
    country: string().required(),
    postalCode: string().required()
});