import { RegisterUserDTO, RegisterGoogleUserDTO } from '../dto/userDTO';
import { User } from '../entity/user';

class UserMapper {
    static createUserFromRegisterUserDTO(dto: RegisterUserDTO): User {
        const user = new User();
        user.email = dto.email;
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.password = dto.password;
        // set other fields...
        return user;
    }

    static createUserFromRegisterGoogleUserDTO(dto: RegisterGoogleUserDTO): User {
        const user = new User();
        user.email = dto.email;
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.googleId = dto.googleId;
        // set other fields...
        return user;
    }
}

export { UserMapper };