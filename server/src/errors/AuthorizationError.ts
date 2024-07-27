import { CustomError } from "./CustomError";

export class AuthorizationError extends CustomError {
    public readonly statusCode = 401;
    public readonly logging: boolean = false;
    constructor(message?: string);
    constructor(errorObject: { message?: string, logging?: boolean });
    constructor(errorInfo?: string | { message?: string, logging?: boolean } ) {
        if (typeof errorInfo === 'undefined') {
            errorInfo = '';
        }
        super(typeof errorInfo === 'object' ? errorInfo.message : errorInfo);
        if (typeof errorInfo === 'object') {
            this.logging = errorInfo.logging ?? this.logging;
        }
        // ↓ Only because we are extending a built in class
        // Object.setPrototypeOf(this, CustomError.prototype);
    }
}