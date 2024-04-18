"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRouter = void 0;
const express_1 = require("express");
const __1 = require("../");
const passport_1 = __importDefault(require("passport"));
const entity_1 = require("../entity");
const mapper_1 = require("../mapper");
const router = (0, express_1.Router)({ mergeParams: true });
// get all addresses
router.get("/", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield user.addresses.init();
        res.send(user.addresses.getItems());
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// get address by id
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield user.addresses.init();
        const address = user.addresses.getItems().find((address) => address.id === req.params.id);
        if (!address) {
            return res.status(404).send({ message: "Address not found" });
        }
        res.send(address);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// create new address
// todo check if the user table is flushed, will the address be added to the address table
// todo or it needs to be added to the address table manually
router.post("/", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if the request body is valid
        const validatedData = yield entity_1.CreateNewAddressSchema.validate(req.body).catch((err) => {
            res.status(400).json({ error: err.errors });
        });
        if (!validatedData) {
            return;
        }
        const user = req.user;
        const addressDTO = req.body;
        const address = mapper_1.AddressMapper.createAddressFromDTO(addressDTO);
        user.addresses.add(address);
        yield __1.DI.userRepository.flush();
        res.status(201).send(address);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// update address
router.put("/:id", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield user.addresses.init();
        const address = user.addresses.getItems().find((address) => address.id === req.params.id);
        const addressDTO = req.body;
        if (!address) {
            return res.status(404).send({ message: "Address not found" });
        }
        mapper_1.AddressMapper.updateAddressFromDTO(address, addressDTO);
        yield __1.DI.userRepository.flush();
        res.send(address);
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
// delete address
router.delete("/:id", passport_1.default.authenticate("jwt", { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield user.addresses.init();
        const address = user.addresses.getItems().find((address) => address.id === req.params.id);
        if (!address) {
            return res.status(404).send({ message: "Address not found" });
        }
        user.addresses.remove(address);
        yield __1.DI.userRepository.flush();
        yield __1.DI.addressRepository.removeAndFlush(address);
        res.send({ message: "Address deleted" });
    }
    catch (e) {
        return res.status(400).send({ message: e.message });
    }
}));
exports.addressRouter = router;
