"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const core_1 = require("@mikro-orm/core");
const entity_1 = require("../entity");
const user_1 = require("../entity/user");
class UserMapper {
    static createUserFromRegisterUserDTO(dto) {
        const user = new user_1.User();
        user.email = dto.email;
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.password = dto.password;
        user.orders = new core_1.Collection(user);
        user.wishlists = new core_1.Collection(user);
        user.cart = new entity_1.Cart(user);
        // set other fields...
        user.wishlists.add(new entity_1.Wishlist("Wishlist"));
        user.cart.items = new core_1.Collection(user.cart);
        user.cart.totalPrice = 0;
        return user;
    }
    static createUserFromRegisterGoogleUserDTO(dto) {
        const user = new user_1.User();
        user.email = dto.email;
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.googleId = dto.googleId;
        user.wishlists.add(new entity_1.Wishlist("Wishlist"));
        user.orders = new core_1.Collection(user);
        // set other fields...
        return user;
    }
}
exports.UserMapper = UserMapper;
