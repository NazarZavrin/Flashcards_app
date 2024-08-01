import { statusCodes } from "../utils/statusCodes";

export abstract class CustomError extends Error {
    public abstract readonly statusCode: statusCodes;
    public readonly logging: boolean = false;
    constructor(errorObject?: { message?: string, logging?: boolean }) {
        if (typeof errorObject === 'undefined') {
            errorObject = {};
        }
        super(errorObject.message);
        this.logging = errorObject.logging ?? this.logging;
    }
}