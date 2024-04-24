import { DI } from "..";
import { CreateWishlistSchema, User, Wishlist } from "../entity";

export class wishlistService {
    static async addWishlist(data: any, user: User){
        const validatedData = await CreateWishlistSchema.validate(data);
        if (!validatedData) return;

        await DI.em.populate(user, ["wishlists"]);

        const existingWishlist = user.wishlists.getItems().find(
            (wishlist: Wishlist) => wishlist.wishlistName === validatedData.wishlistName);
        
        if (existingWishlist) throw new Error("Wishlist already exists");

        const wishlist = new Wishlist(validatedData.wishlistName);

        await user.wishlists.add(wishlist);
        await DI.userRepository.flush();
        return wishlist;
    }

    static async deleteWishlist(id: string, user: User){
        await DI.em.populate(user, ["wishlists"]);
        const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === id);
        if (!wishlist) throw new Error("Wishlist not found");
        await user.wishlists.remove(wishlist);
        await DI.userRepository.flush();
        return ({ message: "Wishlist deleted" });
    }

    static async getAllWishlist(user: User){
        await DI.em.populate(user, ["wishlists"]);
        return user.wishlists.getItems();
    }

    static async getWishlistById(id: string, user: User){
        await DI.em.populate(user, ["wishlists.items"]);
        const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === id);
        if (!wishlist) throw new Error("Wishlist not found");
        return wishlist;
    }

    static async updateWishlist(id: string, user: User, data: any){
        await DI.em.populate(user, ["wishlists"]);
        const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === id);
        if (!wishlist) throw new Error("Wishlist not found");
        Object.assign(wishlist, data);
        await DI.userRepository.flush();
        return wishlist;
    }

    static async addItemToWishlist(id: string, itemId: string, user: User){
        await DI.em.populate(user, ["wishlists.items"]);

        const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === id);
        if (!wishlist) throw new Error("Wishlist not found");

        //check if item exists
        // const isItemExists = await itemService.getItemById(itemId);
        // if (!isItemExists) throw new Error("Item not found");
        const item = await DI.itemRepository.findOne({ id: itemId });
        if (!item) throw new Error("Item not found");

        // check if item is in wishlist
        const isItemExistsInWishlist = wishlist.items.getItems().find((item) => item.id === itemId);
        if (isItemExistsInWishlist) throw new Error("Item already in wishlist");

        await wishlist.items.add(item);
        await DI.userRepository.flush();
        return ({ message: "Item added to wishlist"});
    }

    static async deleteItemFromWishlist(id: string, itemId: string, user: User){
        await DI.em.populate(user, ["wishlists.items"]);
        const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === id);
        if (!wishlist) throw new Error("Wishlist not found");

        //check if item exists
        // const isItemExists = await itemService.getItemById(itemId);
        // if (!isItemExists) throw new Error("Item not found");


        // check if item is in wishlist
        const item = wishlist.items.getItems().find((item) => item.id === itemId);
        if (!item) throw new Error("Item not found in wishlist");

        await wishlist.items.remove(item);
        await DI.userRepository.flush();
        return ({ message: "Item removed from wishlist"});
    }
}