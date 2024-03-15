import { RegisterUserDTO, RegisterGoogleUserDTO } from '../dto/userDTO';
import { User } from '../entities/user';

class UserMapper {
    static createUserFromRegisterUserDTO(dto: RegisterUserDTO): User {
        const user = new User(dto.email, dto.firstName, dto.lastName);
        user.password = dto.password;
        // set other fields...
        return user;
    }

    static createUserFromRegisterGoogleUserDTO(dto: RegisterGoogleUserDTO): User {
        const user = new User(dto.email, dto.firstName, dto.lastName);
        user.googleId = dto.googleId;
        // set other fields...
        return user;
    }
}

export { UserMapper };