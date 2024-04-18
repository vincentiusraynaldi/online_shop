"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressMapper = void 0;
const address_1 = require("../entity/address");
class AddressMapper {
    static createAddressFromDTO(dto) {
        const address = new address_1.Address();
        address.street = dto.street;
        address.houseNumber = dto.houseNumber;
        address.city = dto.city;
        address.country = dto.country;
        address.postalCode = dto.postalCode;
        return address;
    }
    static updateAddressFromDTO(address, dto) {
        address.street = dto.street;
        address.houseNumber = dto.houseNumber;
        address.city = dto.city;
        address.country = dto.country;
        address.postalCode = dto.postalCode;
        return address;
    }
}
exports.AddressMapper = AddressMapper;
