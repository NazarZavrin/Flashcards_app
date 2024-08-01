import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/UserModel';
import BadRequestError from '../errors/BadRequestError';

class TokenService {
    // accessTokenExpirationTime: string = '15 seconds';// for testing
    accessTokenExpirationTime: string = '30 minutes';
    // refreshTokenExpirationTime: string = '30 seconds';// for testing
    refreshTokenExpirationTime: string = '30 days';
    generateTokens(payload: object) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: this.accessTokenExpirationTime });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: this.refreshTokenExpirationTime });
        return { accessToken, refreshToken };
    }
    validateAccessToken(accessToken: string) {
        try {
            // jwt.verify(...) as IUser? https://stackoverflow.com/questions/68024844/how-can-get-the-property-from-result-of-jwt-verify-method-that-was-already-cre
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            if (typeof userData === 'string') {
                throw new BadRequestError("jwt.verify() returned string while validated access token.");
            }
            return userData;
        } catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            }
            return null;
        }
    }
    validateRefreshToken(refreshToken: string) {
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }
    async saveToken(id: any, refreshToken: string) {
        
    }
}

export const tokenService = new TokenService();