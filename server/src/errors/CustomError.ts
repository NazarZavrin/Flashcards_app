import { statusCodes } from "../utils/statusCodes";

export abstract class CustomError extends Error {
    public abstract readonly statusCode: statusCodes;
    public readonly logging: boolean = false;
    constructor(message?: string, options?: { logging?: boolean }) {
        if (typeof message === 'undefined') {
            message = '';
        }
        super(message);
        this.logging = options?.logging ?? this.logging;
    }
}