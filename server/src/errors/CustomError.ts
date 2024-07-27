import { statusCodes } from "../utils/statusCodes";

export abstract class CustomError extends Error {
    abstract readonly statusCode: statusCodes;
    abstract readonly logging: boolean;
    constructor(message?: string) {
        super(message);
        // ↓ Only because we are extending a built in class
        // Object.setPrototypeOf(this, CustomError.prototype);
    }
}