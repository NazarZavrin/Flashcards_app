import { CustomError } from "./CustomError";
import { statusCodes } from "../utils/statusCodes";

export class AuthorizationError extends CustomError {
    public readonly statusCode: statusCodes = 401;
    constructor(message?: string);
    constructor(errorObject: { message?: string, logging?: boolean });
    constructor(errorInfo?: string | { message?: string, logging?: boolean }) {
        if (typeof errorInfo === 'undefined') {
            errorInfo = '';
        }
        super(typeof errorInfo === 'object' ? errorInfo : { message: errorInfo });
    }
}