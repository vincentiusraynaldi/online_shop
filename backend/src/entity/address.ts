import { Entity, ManyToMany, Property, Collection } from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { User } from ".";
import { object, string } from "yup";

@Entity()
export class Address extends BaseEntity{
    @ManyToMany({ entity: () => User })
    users = new Collection<User>(this);

    @Property({ nullable: true })
    street?: string;

    @Property({ nullable: true })
    houseNumber?: string;

    //todo: more info string
    // @Property({ nullable: true })

    @Property({ nullable: true })
    city?: string;

    @Property({ nullable: true })
    country?: string;

    @Property({ nullable:true })
    postalCode?: string;

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