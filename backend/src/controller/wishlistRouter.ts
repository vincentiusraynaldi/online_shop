import { Router } from "express";
import { DI } from "..";
import { CreateWishlistSchema, Item, Wishlist } from "../entity";
import passport from "passport";
import { wishlistService } from "../service/wishlistService";

const router = Router({mergeParams: true})

// add wishlist
router.post("/",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        
        const wishlist = await wishlistService.addWishlist(req.body, req.user);

        return res.status(201).json(wishlist);
    }catch (e: any) {
        return res.status(400).send({ message: e.message });        
    }
});

// show all wishlist
router.get("/",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const wishlists = await wishlistService.getAllWishlist(req.user);
        
        return res.status(200).send(wishlists);
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// show all items in wishlist by id
router.get("/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const wishlist = await wishlistService.getWishlistById(req.params.id, req.user);
        res.status(200).send(wishlist);
    }
    catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// update wishlist (change name)
router.put("/:id",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const updatedWishlist = await wishlistService.updateWishlist(req.params.id, req.user, req.body);
        return res.status(200).json(updatedWishlist);
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// delete wishlist
router.delete("/:id",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const deletionResult = await wishlistService.deleteWishlist(req.params.id, req.user);
        return res.status(200).send(deletionResult);
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// delete item in wishlist
router.delete("/:id/:itemId",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const deletionResult = await wishlistService.deleteItemFromWishlist(req.params.id, req.params.itemId, req.user);
        return res.status(200).send(deletionResult);
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// add item to wishlist
router.post('/:wishlistId/:itemId',passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const addItemResult = await wishlistService.addItemToWishlist(req.params.wishlistId, req.params.itemId, req.user);
        res.status(200).send(addItemResult);
    } catch (e: any) {
        return res.status(400).send({ message: e.message });    
    }
    });

export const wishlistRouter = router;