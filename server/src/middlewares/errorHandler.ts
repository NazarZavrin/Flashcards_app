import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';
import { statusCodes } from '../utils/statusCodes';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
        if (error.logging) {
            console.error(error.message);
        }
        return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    console.error(error.message);
    return res.status(statusCodes.InternalServerError).json({ success: false, message: error.message });
}