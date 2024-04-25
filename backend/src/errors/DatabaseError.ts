import { CustomError } from "../utils/CustomError";

export class DatabaseError extends CustomError {
    statusCode = 500;
    constructor() {
        super("Internal Server Error");
    }
    serializeErrors() {
        return { message: "Internal Server Error" };
    }
}