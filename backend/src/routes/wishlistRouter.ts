import { Router } from "express";
import { DI } from "../";
import { CreateWishlistSchema, Item, Wishlist } from "../entity";
import passport from "passport";

const router = Router({mergeParams: true})

// add wishlist
router.post("/",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const validatedData = await CreateWishlistSchema.validate(req.body).catch(
            (err) => {res.status(400).send({ error: err.errors })}
        );
        if (!validatedData) return;

        // const existingWishlist = await DI.wishlistRepository.findOne({
        //     wishlistName: validatedData.wishlistName
        // });
        // if (existingWishlist) return res.status(400).send({ message: "Wishlist already exists" });

        // const newWishlist = await DI.wishlistRepository.persistAndFlush(validatedData);
        
        // return res.status(201).json(newWishlist);

        const user = req.user;
        const wishlist = new Wishlist(req.body);
        // const wishlist = DI.wishlistRepository.create(req.body);
        user.wishlists.add(wishlist);
        await DI.userRepository.flush();
        return res.status(201).json(wishlist);
    }catch (e: any) {
        return res.status(400).send({ message: e.message });        
    }
});

// show all wishlist
router.get("/",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const user = req.user;
        await user.wishlists.init();
        res.send(user.wishlists.getItems());
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// show all items in wishlist by id
router.get("/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const user = req.user;
        await user.wishlists.init();
        const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === req.params.id);
        if (!wishlist) return res.status(404).send({ message: "Wishlist not found" });
        await wishlist.items.init();
        console.log(wishlist.items);

        res.send(wishlist.items);
    }
    catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// update wishlist (change name)
router.put("/:id",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const user = req.user;
        await user.wishlists.init();
        const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === req.params.id);
        if (!wishlist) return res.status(404).send({ message: "Wishlist not found" });
        Object.assign(wishlist, req.body);
        await DI.userRepository.flush();
        return res.status(200).json(wishlist);
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// delete wishlist
router.delete("/:id",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        const user = req.user;
        await user.wishlists.init();
        const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === req.params.id);
        if (!wishlist) return res.status(404).send({ message: "Wishlist not found" });
        await DI.userRepository.flush();
        await DI.wishlistRepository.removeAndFlush(wishlist);
        return res.status(200).send({ message: "Wishlist deleted" });
    }catch(e: any){
        return res.status(400).send({ message: e.message });
    }
});

// delete item in wishlist
router.delete("/:id/:itemId",passport.authenticate("jwt", {session: false}), async (req, res) => {
    try{
        // const wishlist = await DI.wishlistRepository.findOne({ id: req.params.id });
        const user = req.user;
        await user.wishlists.init();
        const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === req.params.id);
        if (!wishlist) return res.status(404).send({ message: "Wishlist not found" });

        const item = await DI.itemRepository.findOne({ id: req.params.itemId });
        if (!item) return res.status(404).send({ message: "Item not found" });


        await wishlist.items.init();

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

// add item to wishlist
router.post('/:wishlistId/:itemId',passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
            const user = req.user;
            console.log(user);
            const item = await DI.itemRepository.findOne({ id: req.params.itemId });
    
            await user.wishlists.init();
    
            const wishlist = user.wishlists.getItems().find((wishlist: Wishlist) => wishlist.id === req.params.wishlistId);
            if (!item) return res.status(404).send({ message: 'Item not found' });
            if (!wishlist) return res.status(404).send({ message: 'Wishlist not found' });
    
            await wishlist.items.init();
    
            //check if item is already in wishlist
            if (wishlist.items.contains(item)) return res.status(400).send({ message: 'Item already in wishlist' });
    
            wishlist.items.add(item);
            wishlist.user = user;
            await DI.userRepository.flush();
            
            res.send(wishlist);
    } catch (e: any) {
        return res.status(400).send({ message: e.message });    
    }
    });

export const wishlistRouter = router;