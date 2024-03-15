"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_1 = require("../entities/user");
class UserMapper {
    static createUserFromRegisterUserDTO(dto) {
        const user = new user_1.User(dto.email, dto.firstName, dto.lastName);
        user.password = dto.password;
        // set other fields...
        return user;
    }
    static createUserFromRegisterGoogleUserDTO(dto) {
        const user = new user_1.User(dto.email, dto.firstName, dto.lastName);
        user.googleId = dto.googleId;
        // set other fields...
        return user;
    }
}
exports.UserMapper = UserMapper;
