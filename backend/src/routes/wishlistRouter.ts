import { Router } from "express";
import passport from "passport";
import { wishlistController } from "../controller/wishlistContoller";

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
router.delete("/:id/:itemId", authenticateJWT, wishlistController.deleteItemFromWishlist);

// add item to wishlist
router.post('/:wishlistId/:itemId', authenticateJWT, wishlistController.addItemToWishlist);

export const wishlistRouter = router;