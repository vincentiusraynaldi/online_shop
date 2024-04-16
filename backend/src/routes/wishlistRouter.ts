import { Router } from "express";
import { DI } from "../";
import { CreateWishlistSchema } from "../entity";
import passport from "passport";

const router = Router({mergeParams: true})

// add wishlist
router.post("/", async (req, res) => {
    try {
        const validatedData = await CreateWishlistSchema.validate(req.body).catch(
            (err) => {res.status(400).send({ error: err.errors })}
        );
        if (!validatedData) return;

        const existingWishlist = await DI.wishlistRepository.findOne({
            wishlistName: validatedData.wishlistName
        });
        if (existingWishlist) return res.status(400).send({ message: "Wishlist already exists" });

        const newWishlist = await DI.wishlistRepository.persistAndFlush(validatedData);
        
        return res.status(201).json(newWishlist);
    }catch (e: any) {
        return res.status(400).send({ message: e.message });        
    }
});

// show all wishlist
router.get("/", async (req, res) => {
    try{
        const wishlist = await DI.wishlistRepository.findAll();
        res.send(wishlist);
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// show all items in wishlist by id
router.get("/:id", async (req, res) => {
    try{
        const wishlist = await DI.wishlistRepository.findOne({ id: req.params.id });
        if (!wishlist) return res.status(404).send({ message: "Wishlist not found" });

        res.send(wishlist.items);
    }
    catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// update wishlist (change name)
router.put("/:id", async (req, res) => {
    try{
        const wishlist = await DI.wishlistRepository.findOne({ id: req.params.id });
        if (!wishlist) return res.status(404).send({ message: "Wishlist not found" });

        Object.assign(wishlist, req.body);
        await DI.wishlistRepository.flush();
        return res.status(200).json(wishlist);
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// delete wishlist
router.delete("/:id", async (req, res) => {
    try{
        const wishlist = await DI.wishlistRepository.findOne({ id: req.params.id });
        if (!wishlist) return res.status(404).send({ message: "Wishlist not found" });

        await DI.wishlistRepository.removeAndFlush(wishlist);
        return res.status(200).send({ message: "Wishlist deleted" });
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// delete item in wishlist
router.delete("/:id/:itemId", async (req, res) => {
    try{
        const wishlist = await DI.wishlistRepository.findOne({ id: req.params.id });
        if (!wishlist) return res.status(404).send({ message: "Wishlist not found" });

        const item = await DI.itemRepository.findOne({ id: req.params.itemId });
        if (!item) return res.status(404).send({ message: "Item not found" });

        // check if item is in wishlist
        if (!wishlist.items.contains(item)) 
        return res.status(404).send({ message: "Item not in wishlist" });

        wishlist.items.remove(item);
        await DI.wishlistRepository.flush();
        return res.status(200).send({ message: "Item removed from wishlist" });
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

export const wishlistRouter = router;