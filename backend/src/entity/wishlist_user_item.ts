import { Entity, ManyToOne } from "@mikro-orm/core";
import { Wishlist, User, Item } from "./";

@Entity()
export class WishlistUserItem {
    @ManyToOne({ entity: () => Wishlist, primary: true })
    wishlist!: Wishlist;
    
    @ManyToOne({ entity: () => User, primary: true })
    user!: User;

    @ManyToOne({ entity: () => Item, primary: true })
    items = new Set<Item>;

    constructor(wishlist: Wishlist, user: User, items: Set<Item>) {
        this.wishlist = wishlist;
        this.user = user;
        this.items = items;
    }
}