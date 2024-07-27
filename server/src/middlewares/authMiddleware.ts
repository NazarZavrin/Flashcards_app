import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../errors/AuthorizationError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const unauthorizedError = new AuthorizationError({ message: "User is not authorized" });
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return next(unauthorizedError);
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
        return next(unauthorizedError);
    }
    next();
}