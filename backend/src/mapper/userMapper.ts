import { Collection } from '@mikro-orm/core';
import { RegisterUserDTO, RegisterGoogleUserDTO } from '../dto/userDTO';
import { Item, Wishlist, Order, Cart, CartItem } from '../entity';
import { User } from '../entity/user';

class UserMapper {
    static createUserFromRegisterUserDTO(dto: RegisterUserDTO): User {
        const user = new User();
        user.email = dto.email;
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.password = dto.password;
        user.orders = new Collection<Order>(user);
        user.wishlists = new Collection<Wishlist>(user);
        user.cart = new Cart(user);
        // set other fields...
        user.wishlists.add(new Wishlist("Wishlist"));
        user.cart.items = new Collection<CartItem>(user.cart);
        user.cart.totalPrice = 0;
        return user;
    }

    static createUserFromRegisterGoogleUserDTO(dto: RegisterGoogleUserDTO): User {
        const user = new User();
        user.email = dto.email;
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.googleId = dto.googleId;
        user.orders = new Collection<Order>(user);
        user.wishlists = new Collection<Wishlist>(user);
        user.cart = new Cart(user);
        // set other fields...
        user.wishlists.add(new Wishlist("Wishlist"));
        user.cart.items = new Collection<CartItem>(user.cart);
        user.cart.totalPrice = 0;
        return user;
    }
}

export { UserMapper };