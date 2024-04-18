import { Address } from '../entity/address';
import { AddressDTO } from '../dto/addressDTO';

class AddressMapper {
  static createAddressFromDTO(dto: AddressDTO): Address {
    const address = new Address();
    address.street = dto.street;
    address.houseNumber = dto.houseNumber;
    address.city = dto.city;
    address.country = dto.country;
    address.postalCode = dto.postalCode;
    return address;
  }

  static updateAddressFromDTO(address: Address, dto: AddressDTO): Address {
    address.street = dto.street;
    address.houseNumber = dto.houseNumber;
    address.city = dto.city;
    address.country = dto.country;
    address.postalCode = dto.postalCode;
    return address;
  }
}

export { AddressMapper };