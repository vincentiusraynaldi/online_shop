import { Router } from "express";
import passport from "passport";
import { addressController } from "../controller/addressController";


const router = Router({mergeParams: true});

const authenticateJWT = passport.authenticate("jwt", { session: false });

// get all addresses
router.get("/", authenticateJWT , addressController.getAdresses);

// get address by id
router.get("/:id", authenticateJWT, addressController.getAddressById);

// create new address
// todo check if the user table is flushed, will the address be added to the address table
// todo or it needs to be added to the address table manually
router.post("/", authenticateJWT, addressController.createAddress);

// update address
router.put("/:id", authenticateJWT, addressController.updateAddress);

// delete address
router.delete("/:id", authenticateJWT, addressController.deleteAddress);

export const addressRouter = router;