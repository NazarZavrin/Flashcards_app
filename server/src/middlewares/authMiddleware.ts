import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../errors/AuthorizationError';
import { tokenService } from '../utils/TokenService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const unauthorizedError = new AuthorizationError("User is not authorized");
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(unauthorizedError);
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(unauthorizedError);
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(unauthorizedError);
        }
        req.user = userData;
        next();
    } catch (error) {
        return next(unauthorizedError);
    }
}