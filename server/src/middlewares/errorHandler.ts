import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';
import { statusCodes } from '../utils/statusCodes';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
        if (error.logging) {
            console.error(req.originalUrl + ": " + error.message);
        }
        return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(req.originalUrl + ": " + error.message);
    // console.log(error.stack);
    return res.status(statusCodes.InternalServerError).json({ message: error.message });
}