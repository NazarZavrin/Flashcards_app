import { CustomError } from "./CustomError";
import { statusCodes } from "../utils/statusCodes";

export default class BadRequestError extends CustomError {
    public readonly statusCode: statusCodes = 400;
    constructor(message?: string, options?: { logging?: boolean }) {
        super(message, options);
    }
}