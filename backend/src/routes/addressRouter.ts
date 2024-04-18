import { Router } from "express";
import { DI } from "../";
import passport from "passport";
import { Address, CreateNewAddressSchema } from "../entity";
import { AddressMapper } from "../mapper";


const router = Router({mergeParams: true});

// get all addresses
router.get("/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const user = req.user;
        await user.addresses.init();
        res.send(user.addresses.getItems());
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

// get address by id
router.get("/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const user = req.user;
        await user.addresses.init();
        const address = user.addresses.getItems().find((address: Address) => address.id === req.params.id);
        if (!address) {
            return res.status(404).send({message: "Address not found"});
        }
        res.send(address);
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

// create new address
// todo check if the user table is flushed, will the address be added to the address table
// todo or it needs to be added to the address table manually
router.post("/", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {

        // check if the request body is valid
        const validatedData = await CreateNewAddressSchema.validate(req.body).catch(
            (err) => {
                res.status(400).json({ error: err.errors });
            }
        );
        if(!validatedData){
            return;
        }

        const user = req.user;
        const addressDTO = req.body;
        const address = AddressMapper.createAddressFromDTO(addressDTO);
        user.addresses.add(address);
        await DI.userRepository.flush();
        res.status(201).send(address);
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

// update address
router.put("/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const user = req.user;
        await user.addresses.init();
        const address = user.addresses.getItems().find((address: Address) => address.id === req.params.id);
        const addressDTO = req.body;
        if (!address) {
            return res.status(404).send({message: "Address not found"});
        }
        AddressMapper.updateAddressFromDTO(address, addressDTO);
        await DI.userRepository.flush();
        res.send(address);
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

// delete address
router.delete("/:id", passport.authenticate("jwt", {session: false}), async (req, res) => {
    try {
        const user = req.user;
        await user.addresses.init();
        const address = user.addresses.getItems().find((address: Address) => address.id === req.params.id);
        if (!address) {
            return res.status(404).send({message: "Address not found"});
        }
        user.addresses.remove(address);
        await DI.userRepository.flush();
        await DI.addressRepository.removeAndFlush(address);
        res.send({message: "Address deleted"});
    }
    catch (e: any) {
        return res.status(400).send({message: e.message});
    }
});

export const addressRouter = router;