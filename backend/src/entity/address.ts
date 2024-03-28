import { Embeddable, Property } from "@mikro-orm/core";

@Embeddable()
export class Address {
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
}