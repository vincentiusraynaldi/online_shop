import { DI } from "..";
import { Address, User } from "../entity";
import { AddressMapper } from "../mapper";

export class addressService {
    static async getAddresses(user: User) {
        await DI.em.populate(user, ["addresses"]);
        return user.addresses.getItems();
    }

    static async getAddressById(id: string, user: User) {
        await DI.em.populate(user, ["addresses"]);
        
        const address = user.addresses.getItems().find((address: Address) => address.id === id);
        if (!address) throw new Error("Address not found");
        
        return address;
    }

    static async createAddress(data: any, user: User) {
        const address = AddressMapper.createAddressFromDTO(data);
        
        user.addresses.add(address);
        await DI.userRepository.flush();
        
        return address;
    }

    static async updateAddress(id: string, data: any, user: User) {
        await DI.em.populate(user, ["addresses"]);
        
        const address = user.addresses.getItems().find((address: Address) => address.id === id);
        if (!address) throw new Error("Address not found");
        
        AddressMapper.updateAddressFromDTO(address, data);
        
        await DI.userRepository.flush();
        return address;
    }

    static async deleteAddress(id: string, user: User) {
        await DI.em.populate(user, ["addresses"]);

        const address = user.addresses.getItems().find((address: Address) => address.id === id);
        if (!address) throw new Error("Address not found");
        
        user.addresses.remove(address);
        await DI.userRepository.flush();
        
        return { message: "Address deleted" };
    }
}