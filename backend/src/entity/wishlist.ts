import { Item, User } from "./";
import {
    Collection,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToOne,
    Property,
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { object, string, number } from "yup";

@Entity()
class Wishlist extends BaseEntity {
    @ManyToOne({ entity: () => User})
    user!: User;

    @ManyToMany({ entity: () => Item })
    items = new Collection<Item>(this);

    @Property()
    wishlistName?: string;

    constructor(wishlistName?: string) {
        super();
        this.wishlistName = wishlistName;
        this.items = new Collection<Item>(this);
    }
}

export { Wishlist };

//!! need to think about how to implement the wishlist entity
//!! need to think about composition or asosiation of wishlist from user entity
//!! need to think about the relationship between wishlist and item entity (one to many and reference)

export const CreateWishlistSchema = object({
    wishlistName: string().required(),
});