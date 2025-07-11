import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { tokenService } from '../utils/TokenService';
import BadRequestError from '../errors/BadRequestError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const unauthorizedError = new UnauthorizedError();
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
        if (error instanceof BadRequestError) { // validateAccessToken throws BadRequestError
            return next(error);
        }
        return next(unauthorizedError);
    }
}