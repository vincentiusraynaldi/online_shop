import { Item, User } from "./";
import {
    Entity,
    ManyToMany,
    ManyToOne,
    OneToOne,
    Property,
}
from "@mikro-orm/core";
import { BaseEntity } from "./baseEntity";
import { WishlistUserItem } from "./wishlist_user_item";
import { object, string, number } from "yup";

@Entity()
class Wishlist extends BaseEntity {
    @ManyToOne({entity: () => User, inversedBy: (user: User) => user.wishlists})
    userId!: string;

    @ManyToMany({ entity: () => Item, pivotEntity: () => WishlistUserItem})
    items = new Set<Item>();

    @Property()
    wishlistName?: string;

    constructor(wishlistName?: string) {
        super();
        this.wishlistName = wishlistName;
    }
}

export { Wishlist };

//!! need to think about how to implement the wishlist entity
//!! need to think about composition or asosiation of wishlist from user entity
//!! need to think about the relationship between wishlist and item entity (one to many and reference)

export const CreateWishlistSchema = object({
    wishlistName: string().required(),
});