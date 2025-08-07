import { CustomError } from "./CustomError";
import { statusCodes } from "../utils/statusCodes";

export class UnauthorizedError extends CustomError {
    public readonly statusCode: statusCodes = 401;
    constructor(message?: string, options?: { logging?: boolean }) {
        if (typeof message === 'undefined') {
            message = 'User is not authorized';
        }
        super(message, options);
    }
}