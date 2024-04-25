import { CustomError } from "../utils/CustomError";

export class AuthenticationError extends CustomError {
    statusCode = 401;

    constructor() {
        super("Not authenticated");
    }

    serializeErrors(): { message: string } { // Add square brackets to indicate an array return type
        return { message: "Not authenticated" }; // Wrap the object in an array
    }   
}