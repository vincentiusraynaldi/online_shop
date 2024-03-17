export type RegisterUserDTO = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
};

export type RegisterGoogleUserDTO = {
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
};