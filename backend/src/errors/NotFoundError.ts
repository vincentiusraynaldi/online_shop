import { CustomError } from "../utils/CustomError";

export class NotFoundError extends CustomError {
    statusCode = 404;
    constructor(message: string) {
        super(`${message} not found`);
    }
    serializeErrors() {
        return { message: this.message };
    }
}