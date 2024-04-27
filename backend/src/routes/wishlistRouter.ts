import { Router } from "express";
import passport from "passport";
import { wishlistController } from "../controller/wishlistContoller";

//todo refactor the itemrouter itemcontroller and itemservice
//todo test the items
//todo test the wishlist
//todo test user

const router = Router({mergeParams: true})

const authenticateJWT = passport.authenticate('jwt', { session: false });

// add wishlist
router.post("/", authenticateJWT, wishlistController.addWishlist);

// show all wishlist
router.get("/", authenticateJWT, wishlistController.getAllWishlist);

// show all items in wishlist by id
router.get("/:id", authenticateJWT, wishlistController.getWishlistById);

// update wishlist (change name)
router.put("/:id", authenticateJWT, wishlistController.updateWishlist);

// delete wishlist
router.delete("/:id", authenticateJWT, wishlistController.deleteWishlist);

// delete item in wishlist
router.delete("/:wishlistId/items/:itemId", authenticateJWT, wishlistController.deleteItemFromWishlist);

// add item to wishlist
router.post('/:wishlistId/items/:itemId', authenticateJWT, wishlistController.addItemToWishlist);

export const wishlistRouter = router;